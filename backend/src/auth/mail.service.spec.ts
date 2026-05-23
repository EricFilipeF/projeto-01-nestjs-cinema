import nodemailer from 'nodemailer';
import { InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_ADMIN_EMAIL } from './auth.constants';
import { MailService } from './mail.service';

describe('MailService', () => {
  const environmentBackup = { ...process.env };

  afterEach(() => {
    process.env = { ...environmentBackup };
    jest.restoreAllMocks();
  });

  it('uses SMTP without auth in development when credentials are missing', async () => {
    process.env = { ...environmentBackup, NODE_ENV: 'development' };

    const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'dev-message-id' });
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: sendMailMock,
    } as never);

    const service = new MailService();

    await service.sendPasswordResetToken('user@example.com', 'ABC123');

    expect(createTransportSpy).toHaveBeenCalledWith({
      host: 'localhost',
      port: 1025,
      secure: false,
    });
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: DEFAULT_ADMIN_EMAIL,
        to: 'user@example.com',
        subject: 'Recuperação de senha CineWeb',
      }),
    );
  });

  it('uses configured SMTP credentials when present', async () => {
    process.env = {
      ...environmentBackup,
      NODE_ENV: 'development',
      SMTP_HOST: 'smtp.mailpit.local',
      SMTP_PORT: '1025',
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
    };

    const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'smtp-message-id' });
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: sendMailMock,
    } as never);

    const service = new MailService();

    await service.sendPasswordResetToken('user@example.com', 'ABC123');

    expect(createTransportSpy).toHaveBeenCalledWith({
      host: 'smtp.mailpit.local',
      port: 1025,
      secure: false,
      auth: {
        user: 'user',
        pass: 'pass',
      },
    });
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'user',
        to: 'user@example.com',
        subject: 'Recuperação de senha CineWeb',
      }),
    );
  });

  it('keeps the production guard when SMTP credentials are missing', async () => {
    process.env = { ...environmentBackup, NODE_ENV: 'production' };

    const service = new MailService();

    await expect(service.sendPasswordResetToken('user@example.com', 'ABC123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});