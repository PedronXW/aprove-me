import { MailService } from '@/domain/application/services/mail/mail-service'
import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { BrokerRepository } from '../../broker/broker-repository'
import { BatchCreationService } from './batch-creation'

let sut: BatchCreationService
let brokerRepository: BrokerRepository

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

    expect(brokerRepository.sendMessage).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
    )

    expect(brokerRepository.sendMessage).toHaveBeenCalledTimes(2)
  })
})
