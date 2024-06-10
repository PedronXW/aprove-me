import { BrokerRepository } from '@/domain/application/broker/broker-repository'
import { CacheRepository } from '@/domain/application/cache/cache-repository'
import { MailService } from '@/domain/application/services/mail/mail-service'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller()
export class BatchConsumerController {
  constructor(
    private createPayableService: CreatePayableService,
    private mailService: MailService,
    private brokerRepository: BrokerRepository,
    private cacheRepository: CacheRepository,
  ) {}

  @MessagePattern('QUEUE')
  public async execute(@Payload() payload: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    const data = JSON.parse(payload)

    if (data.batchFinished) {
      const successCount = await this.cacheRepository.get(
        'payable:batch:' + data.batchId,
      )
      this.mailService.execute({
        mailType: 'QUEUE_RESULT',
        to: 'operationteam@aprove.me',
        text:
          'QUEUE_FINISHED - ' +
          successCount +
          ' registers has been successfully processed, and ' +
          (data.batchQuantity - Number.parseInt(successCount)) +
          ' registers has failed.',
      })
      channel.ack(originalMsg)
      return
    }

    const result = await this.createPayableService.execute(data)

    if (result.isLeft()) {
      console.error('QUEUE_FAILURE - ' + payload, result.value)
      this.brokerRepository.sendMessageToDeadQueue(payload)
      this.mailService.execute({
        mailType: 'QUEUE_FAILURE',
        to: 'operationteam@aprove.me',
        text: 'QUEUE_FAILURE - ' + payload,
      })
      return
    }

    const successCount = await this.cacheRepository.get(
      'payable:batch:' + data.batchId,
    )

    await this.cacheRepository.set(
      'payable:batch:' + data.batchId,
      successCount
        ? (Number.parseInt(successCount) + Number(1)).toString()
        : Number(1).toString(),
    )

    channel.ack(originalMsg)
  }
}
