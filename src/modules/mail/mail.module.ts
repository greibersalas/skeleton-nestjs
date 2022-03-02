import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(Configuration.MAIL_HOSTNAME),
          secure: false,
          auth: {
            user: configService.get(Configuration.MAIL_USERNAME),
            pass: configService.get(Configuration.MAIL_PASSWORD)
          },
        },
        defaults: {
          from: `"Brenda de Maxillaris" <maxillaris@mano.guru>`,
          replyTo: Configuration.MAIL_REPLYTO
        },
        template: {
          dir: join(__dirname, 'templates'),//__dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          },
        },
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}