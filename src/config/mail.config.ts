import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        secure: true, // Use SSL
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `FX Trading App <${this.configService.get<string>('MAIL_USER')}>`,
      },
    };
  }
}
