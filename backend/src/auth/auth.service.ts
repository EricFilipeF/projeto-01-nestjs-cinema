import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_NAME,
  DEFAULT_JWT_EXPIRES_IN_SECONDS,
  DEFAULT_JWT_SECRET,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { signJwt, verifyJwt, type JwtPayload } from './jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from './password';
import { UserRole } from '../generated/prisma/client';
import { generateRecoveryToken, hashRecoveryToken } from './recovery-token';
import { MailService } from './mail.service';
import { DEFAULT_PASSWORD_RESET_TOKEN_TTL_MINUTES } from './auth.constants';

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
  private readonly jwtExpiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS) || DEFAULT_JWT_EXPIRES_IN_SECONDS;

  async onModuleInit() {
    await this.ensureDefaultAdminUser();
  }

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !verifyPassword(loginDto.password, user.passwordHash)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payloadUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: signJwt(
        {
          sub: payloadUser.id,
          email: payloadUser.email,
          name: payloadUser.name,
          role: payloadUser.role,
        },
        this.jwtSecret,
        this.jwtExpiresInSeconds,
      ),
      tokenType: 'Bearer',
      user: payloadUser,
    };
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

  verifyAccessToken(token: string): JwtPayload {
    try {
      return verifyJwt(token, this.jwtSecret);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}