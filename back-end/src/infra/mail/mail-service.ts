import { MailRepository } from '@/domain/application/mail/mail-repository'
import { Injectable } from '@nestjs/common'

export type MailToSend = {
  mailType: 'QUEUE_FAILURE' | 'QUEUE_RESULT'
  to: string
  text: string
}

@Injectable()
export class MailService {
  constructor(private mailRepository: MailRepository) {}

  async execute({ mailType, to, text }: MailToSend): Promise<void> {
    if (mailType === 'QUEUE_FAILURE') {
      await this.mailRepository.sendMail({
        from: 'system@aprove.me',
        to,
        subject: 'Queue failed',
        text,
      })
    } else {
      await this.mailRepository.sendMail({
        from: 'system@aprove.me',
        to,
        subject: 'Queue Success',
        text,
      })
    }
  }
}
