import { PayableNonExistsError } from '@/domain/application/errors/PayableNonExists'
import { FindPayableByIdService } from '@/domain/application/services/payable/find-payable-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

@Controller('/payables')
export class FindPayableByIdController {
  constructor(
    private readonly findPayableByIdService: FindPayableByIdService,
  ) {}

  @Get('/:id')
  async handle(@Param('id') id: string, @CurrentUser() payable: UserPayload) {
    const { sub } = payable

    const receivedPayable = await this.findPayableByIdService.execute({
      id,
      receiverId: sub,
    })

    if (receivedPayable.isLeft()) {
      const error = receivedPayable.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { payable: PayablePresenter.toHTTP(receivedPayable.value) }
  }
}
