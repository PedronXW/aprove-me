import { MailRepository } from '@/domain/application/mail/mail-repository'
import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { MailService } from './mail-service'

describe('MailService', () => {
  let sut: MailService
  let mailRepository: MailRepository

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailRepository,
          useValue: createMock<MailRepository>(),
        },
      ],
    }).compile()

    sut = moduleRef.get<MailService>(MailService)
    mailRepository = moduleRef.get<MailRepository>(MailRepository)
  })

  it('should call mailRepository.sendMail with correct params', async () => {
    await sut.execute({
      mailType: 'QUEUE_FAILURE',
      to: '',
      text: '',
    })

    expect(mailRepository.sendMail).toHaveBeenCalledTimes(1)

    expect(mailRepository.sendMail).toHaveBeenCalledWith({
      from: 'system@aprove.me',
      subject: 'Queue failed',
      to: '',
      text: '',
    })
  })
})
