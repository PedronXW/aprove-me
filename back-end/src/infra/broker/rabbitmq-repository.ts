import { BrokerRepository } from '@/domain/application/broker/broker-repository'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MailService } from '../../domain/application/services/mail/mail-service'

@Injectable()
export class RabbitmqRepository implements BrokerRepository {
  constructor(
    @Inject('QUEUE') private queue: ClientProxy,
    private mailService: MailService,
  ) {}

  async sendMessage(message: string) {
    for (let attempts = 0; attempts < 4; attempts++) {
      try {
        this.queue.emit('QUEUE', message)
        return
      } catch (error) {
        if (attempts === 3) {
          this.queue.emit('DEAD_QUEUE', message)
          await this.mailService.execute({
            mailType: 'QUEUE_FAILURE',
            to: 'operationteam@aprove.me',
            text: 'QUEUE_FAILURE - ' + message + ' - ' + error.message,
          })
          return
        }
      }
    }
  }

  async sendMessageToDeadQueue(message: string) {
    this.queue.emit('DEAD_QUEUE', message)
  }
}
