import { Mail, MailRepository } from '@/domain/application/mail/mail-repository'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NodemailerMailRepository implements MailRepository {
  constructor(private mailer: MailerService) {}

  async sendMail(mail: Mail): Promise<void> {
    // await this.mailer.sendMail(mail)
  }
}
