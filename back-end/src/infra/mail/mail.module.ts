import { MailRepository } from '@/domain/application/mail/mail-repository'
import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { MailService } from '../../domain/application/services/mail/mail-service'
import { NodemailerMailRepository } from './nodemailer-mail-repository'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [
    { provide: MailRepository, useClass: NodemailerMailRepository },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
