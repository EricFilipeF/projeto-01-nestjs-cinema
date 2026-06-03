import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
@ApiBadRequestResponse({ description: 'Dados de requisição inválidos' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiOkResponse({ description: 'Login realizado com sucesso. Retorna o token de acesso.' })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha incorretos' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário diretamente (sem confirmação de e-mail)' })
  @ApiCreatedResponse({ description: 'Usuário registrado com sucesso.' })
  @ApiConflictResponse({ description: 'Já existe uma conta com o e-mail informado' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register/request-code')
  @ApiOperation({ summary: 'Solicita um código de confirmação para registro de e-mail' })
  @ApiCreatedResponse({ description: 'Código de confirmação enviado por e-mail com sucesso.' })
  @ApiConflictResponse({ description: 'Já existe uma conta com o e-mail informado' })
  requestRegistrationCode(@Body() registerDto: RegisterDto) {
    return this.authService.requestRegistrationCode(registerDto);
  }

  @Post('register/confirm')
  @ApiOperation({ summary: 'Confirma o e-mail de registro utilizando o código enviado' })
  @ApiCreatedResponse({ description: 'E-mail confirmado e conta criada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Código de confirmação inválido ou expirado' })
  @ApiConflictResponse({ description: 'Já existe uma conta com o e-mail informado' })
  confirmRegistration(@Body() confirmRegistrationDto: ConfirmRegistrationDto) {
    return this.authService.confirmRegistration(confirmRegistrationDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicita a redefinição de senha enviando um código para o e-mail' })
  @ApiOkResponse({ description: 'Mensagem de confirmação de envio do código.' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefine a senha utilizando o código de recuperação' })
  @ApiOkResponse({ description: 'Senha redefinida com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Código de recuperação inválido ou expirado' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obtém informações do usuário autenticado atualmente' })
  @ApiHeader({
    name: 'authorization',
    description: 'Token de acesso JWT contendo o prefixo Bearer (ex: Bearer <seu_token>)',
    required: true,
    schema: {
      type: 'string',
      default: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm/Do28gZGEgU2lsdmEiLCJlbWFpbCI6InVzdWFyaW9AZXhlbXBsby5jb20iLCJyb2xlIjoiY2xpZW50ZSJ9.signature',
    },
  })
  @ApiOkResponse({ description: 'Retorna os dados do usuário autenticado.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido, expirado ou ausente' })
  me(@Headers('authorization') authorization: string) {
    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    return this.authService.getCurrentUser(token);
  }
}