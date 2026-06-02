import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_NAME,
  DEFAULT_JWT_EXPIRES_IN_SECONDS,
  DEFAULT_JWT_SECRET,
  DEFAULT_PASSWORD_RESET_TOKEN_TTL_MINUTES,
  DEFAULT_REGISTRATION_CONFIRMATION_CODE_TTL_MINUTES,
} from './auth.constants';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { signJwt, verifyJwt, type JwtPayload } from './jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from './password';
import { UserRole } from '../generated/prisma/client';
import { generateRecoveryToken, hashRecoveryToken } from './recovery-token';
import { generateVerificationCode, hashVerificationCode } from './verification-code';
import { MailService } from './mail.service';

type PendingRegistrationRow = {
  email: string;
  name: string;
  passwordHash: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private readonly adminEmail = process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
  private readonly adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  private readonly adminName = process.env.ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;
  private readonly jwtSecret = process.env.JWT_SECRET?.trim() || DEFAULT_JWT_SECRET;
  private readonly jwtExpiresInSeconds =
    Number(process.env.JWT_EXPIRES_IN_SECONDS) || DEFAULT_JWT_EXPIRES_IN_SECONDS;
  private readonly registrationConfirmationCodeTtlMinutes =
    Number(process.env.REGISTRATION_CONFIRMATION_CODE_TTL_MINUTES) ||
    DEFAULT_REGISTRATION_CONFIRMATION_CODE_TTL_MINUTES;

  async onModuleInit() {
    await this.ensureDefaultAdminUser();
    await this.ensurePendingRegistrationTable();
  }

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !verifyPassword(loginDto.password, user.passwordHash)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.createSession(user.id, user.email, user.name, user.role);
  }

  async register(registerDto: RegisterDto) {
    return this.createUser(registerDto.name, registerDto.email, registerDto.password);
  }

  async requestRegistrationCode(registerDto: RegisterDto) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Já existe uma conta com este email');
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + this.registrationConfirmationCodeTtlMinutes * 60 * 1000);

    await this.prisma.$executeRaw`
      DELETE FROM registration_verifications WHERE email = ${normalizedEmail}
    `;

    await this.prisma.$executeRaw`
      INSERT INTO registration_verifications (
        email,
        name,
        password_hash,
        code_hash,
        expires_at,
        created_at,
        updated_at
      )
      VALUES (
        ${normalizedEmail},
        ${registerDto.name.trim()},
        ${hashPassword(registerDto.password)},
        ${hashVerificationCode(code)},
        ${expiresAt},
        NOW(),
        NOW()
      )
    `;

    try {
      await this.mailService.sendRegistrationConfirmationCode(normalizedEmail, code);
    } catch (error) {
      await this.prisma.$executeRaw`
        DELETE FROM registration_verifications WHERE email = ${normalizedEmail}
      `;

      throw error;
    }

    return {
      message: 'Enviamos um código de confirmação para o seu email.',
      expiresAt,
    };
  }

  async confirmRegistration(confirmRegistrationDto: ConfirmRegistrationDto) {
    const normalizedEmail = confirmRegistrationDto.email.trim().toLowerCase();
    const codeHash = hashVerificationCode(confirmRegistrationDto.code.trim());
    const now = new Date();

    const pendingRegistrations = await this.prisma.$queryRaw<PendingRegistrationRow[]>`
      SELECT
        email,
        name,
        password_hash AS "passwordHash"
      FROM registration_verifications
      WHERE email = ${normalizedEmail}
        AND code_hash = ${codeHash}
        AND expires_at > ${now}
      LIMIT 1
    `;

    const pendingRegistration = pendingRegistrations[0];

    if (!pendingRegistration) {
      throw new UnauthorizedException('Código de confirmação inválido ou expirado');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      await this.prisma.$executeRaw`
        DELETE FROM registration_verifications WHERE email = ${normalizedEmail}
      `;

      throw new ConflictException('Já existe uma conta com este email');
    }

    const user = await this.prisma.user.create({
      data: {
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        passwordHash: pendingRegistration.passwordHash,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        role: UserRole.cliente,
      },
    });

    await this.prisma.$executeRaw`
      DELETE FROM registration_verifications WHERE email = ${normalizedEmail}
    `;

    return this.createSession(user.id, user.email, user.name, user.role);
  }

  async getCurrentUser(token: string) {
    const payload = this.verifyAccessToken(token);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const normalizedEmail = forgotPasswordDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return {
        message: 'Se o email existir, um código de recuperação será gerado.',
      };
    }

    const token = generateRecoveryToken();
    const expiresAt = new Date(Date.now() + DEFAULT_PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: hashRecoveryToken(token),
        resetTokenExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendPasswordResetToken(user.email, token);

    return {
      message: 'Enviamos um código de recuperação para o seu email.',
      expiresAt,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenHash = hashRecoveryToken(resetPasswordDto.token.trim());
    const now = new Date();

    const user = await this.prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: {
          gt: now,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Código de recuperação inválido ou expirado');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashPassword(resetPasswordDto.password),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    return {
      message: 'Senha redefinida com sucesso.',
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return verifyJwt(token, this.jwtSecret);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private createSession(id: string, email: string, name: string, role: UserRole) {
    const user = { id, email, name, role };

    return {
      accessToken: signJwt(
        {
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        this.jwtSecret,
        this.jwtExpiresInSeconds,
      ),
      tokenType: 'Bearer' as const,
      user,
    };
  }

  private async createUser(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Já existe uma conta com este email');
    }

    const user = await this.prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        role: UserRole.cliente,
      },
    });

    return this.createSession(user.id, user.email, user.name, user.role);
  }

  private async ensureDefaultAdminUser() {
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: this.adminEmail.toLowerCase() },
    });

    if (existingAdmin) {
      return;
    }

    await this.prisma.user.create({
      data: {
        name: this.adminName,
        email: this.adminEmail.toLowerCase(),
        passwordHash: hashPassword(this.adminPassword),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        role: UserRole.admin,
      },
    });
  }

  private async ensurePendingRegistrationTable() {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS registration_verifications (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }
}