import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { createMock } from '@golevelup/ts-jest'
import { RmqContext } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { BatchConsumerController } from './batch-consumer'

describe('BatchConsumer', () => {
  let sut: BatchConsumerController
  let createPayableService: CreatePayableService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BatchConsumerController,
        {
          provide: CreatePayableService,
          useValue: createMock<CreatePayableService>(),
        },
      ],
    }).compile()

    sut = moduleRef.get<BatchConsumerController>(BatchConsumerController)
    createPayableService =
      moduleRef.get<CreatePayableService>(CreatePayableService)
  })

  it('should call CreatePayableService with the correct params', async () => {
    await sut.execute(
      JSON.stringify({
        value: 1000,
        emissionDate: new Date('2021-01-01'),
        assignorId: '123',
      }),
      createMock<RmqContext>(),
    )

    expect(createPayableService.execute).toHaveBeenCalledTimes(1)

    expect(createPayableService.execute).toHaveBeenCalledWith({
      value: 1000,
      emissionDate: '2021-01-01T00:00:00.000Z',
      assignorId: '123',
    })
  })
})
