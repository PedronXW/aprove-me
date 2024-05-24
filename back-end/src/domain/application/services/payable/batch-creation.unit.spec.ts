import { MailService } from '@/infra/mail/mail-service'
import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { BrokerRepository } from '../../broker/broker-repository'
import { BatchCreationService } from './batch-creation'

let sut: BatchCreationService
let brokerRepository: BrokerRepository
let mailService: MailService

describe('Create Payable', () => {
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BatchCreationService,
        {
          provide: BrokerRepository,
          useValue: createMock<BrokerRepository>(),
        },
        {
          provide: MailService,
          useValue: createMock<MailService>(),
        },
      ],
    }).compile()

    sut = moduleRef.get<BatchCreationService>(BatchCreationService)
    brokerRepository = moduleRef.get<BrokerRepository>(BrokerRepository)
    mailService = moduleRef.get<MailService>(MailService)
  })

  it('should call brokerRepository.sendMessage with correct params', async () => {
    const assignor = await AssignorFactory.create({})
    const payables = [
      {
        value: 100,
        emissionDate: new Date(),
      },
    ]

    await sut.execute({ payables, assignorId: assignor.id.getValue() })

    expect(brokerRepository.sendMessage).toHaveBeenCalledWith(
      JSON.stringify({ ...payables[0], assignorId: assignor.id.getValue() }),
    )

    expect(brokerRepository.sendMessage).toHaveBeenCalledTimes(1)

    expect(mailService.execute).toHaveBeenCalledWith({
      mailType: 'QUEUE_RESULT',
      to: 'operationteam@aprove.me',
      text: 'QUEUE_RESULT - 0 messages failed to be sent',
    })
  })
})
