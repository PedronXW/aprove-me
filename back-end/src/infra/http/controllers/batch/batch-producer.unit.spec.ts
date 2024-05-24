import { BatchCreationService } from '@/domain/application/services/payable/batch-creation'
import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { BatchProducerController } from './batch-producer'

describe('BatchProducer', () => {
  let sut: BatchProducerController
  let batchCreationService: BatchCreationService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BatchProducerController,
        {
          provide: BatchCreationService,
          useValue: createMock<BatchCreationService>(),
        },
      ],
    }).compile()

    sut = moduleRef.get<BatchProducerController>(BatchProducerController)
    batchCreationService =
      moduleRef.get<BatchCreationService>(BatchCreationService)
  })

  it('should call batchCreationService with correct params', async () => {
    await sut.handle(
      {
        payables: [
          {
            value: 1000,
            emissionDate: new Date('2021-01-01'),
          },
        ],
      },
      {
        sub: '123',
      },
    )

    expect(batchCreationService.execute).toHaveBeenCalledTimes(1)

    expect(batchCreationService.execute).toHaveBeenCalledWith({
      payables: [
        {
          value: 1000,
          emissionDate: new Date('2021-01-01'),
        },
      ],
      assignorId: '123',
    })
  })
})
