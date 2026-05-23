import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { DEFAULT_ADMIN_EMAIL } from './auth.constants';

@Injectable()
export class MailService {
  private readonly smtpHost =
    process.env.SMTP_HOST?.trim() || process.env.MAIL_HOST?.trim() || 'smtp.gmail.com';
  private readonly smtpPort = Number(process.env.SMTP_PORT || process.env.MAIL_PORT) || 587;
  private readonly smtpUser = process.env.SMTP_USER?.trim() || process.env.MAIL_USERNAME?.trim();
  private readonly smtpPass = this.normalizeAppPassword(process.env.SMTP_PASS || process.env.MAIL_PASSWORD);
  private readonly mailFrom =
    process.env.MAIL_FROM?.trim() || process.env.MAIL_FROM_ADDRESS?.trim() || this.smtpUser || DEFAULT_ADMIN_EMAIL;

  async sendPasswordResetToken(recipientEmail: string, token: string) {
    const tokenTtlMinutes = process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || '15';

    if (!this.smtpUser || !this.smtpPass) {
      throw new InternalServerErrorException(
        'Configure SMTP_USER e SMTP_PASS com a conta e a senha de app do Gmail.',
      );
    }

    const message = {
      from: this.mailFrom,
      to: recipientEmail,
      subject: 'Recuperação de senha CineWeb',
      text: [
        'Recebemos uma solicitação para redefinir sua senha no CineWeb.',
        '',
        `Seu código de recuperação é: ${token}`,
        '',
        `Esse código expira em ${tokenTtlMinutes} minutos.`,
        '',
        'Se você não solicitou essa redefinição, ignore este email.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
          <h2 style="color: #0d6efd; margin-bottom: 16px;">Recuperação de senha CineWeb</h2>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p><strong>Seu código de recuperação:</strong></p>
          <div style="padding: 16px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; font-size: 18px; letter-spacing: 1px; font-family: monospace;">
            ${token}
          </div>
          <p style="margin-top: 16px;">Esse código expira em ${tokenTtlMinutes} minutos.</p>
          <p>Se você não solicitou essa redefinição, ignore este email.</p>
        </div>
      `,
    };

    const transport = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpPort === 465,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });

    await transport.sendMail(message);
  }

  private normalizeAppPassword(value?: string) {
    return value?.replace(/\s+/g, '').trim();
  }
}