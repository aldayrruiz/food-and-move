import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmployee(user: { email: string; name: string }, password: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenido a Food & Move',
      template: './welcome-employee',
      context: {
        name: user.name,
        password: password,
      },
    });
  }

  async sendForgotPassword(email: string, url: string, time: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Restablecer contraseña - Food & Move',
      template: './forgot-password',
      context: { url, time },
    });
  }
}
