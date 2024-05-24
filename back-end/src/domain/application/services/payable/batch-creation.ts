import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { BrokerRepository } from '../../broker/broker-repository'

export type BatchCreationRequest = {
  payables?: Array<{
    value?: number
    emissionDate?: Date
  }>
  assignorId: string
}

@Injectable()
export class BatchCreationService {
  constructor(private brokerRepository: BrokerRepository) {}

  async execute({ payables, assignorId }: BatchCreationRequest): Promise<void> {
    const batchId = randomUUID()

    for (const payable of payables) {
      await this.brokerRepository.sendMessage(
        JSON.stringify({ ...payable, assignorId, batchId }),
      )
    }

    await this.brokerRepository.sendMessage(
      JSON.stringify({
        batchFinished: true,
        batchQuantity: payables.length,
        batchId,
      }),
    )
  }
}
