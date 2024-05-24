import { PaginationError } from '@/domain/application/errors/pagination-error'
import { FindPayablesService } from '@/domain/application/services/payable/find-payables'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

@Controller('/payable')
export class FindPayablesController {
  constructor(private readonly findPayablesService: FindPayablesService) {}

  @Get()
  async handle(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() payable: UserPayload,
  ) {
    const { sub } = payable

    const receivedPayable = await this.findPayablesService.execute({
      limit,
      page,
      assignorId: sub,
    })

    if (receivedPayable.isLeft()) {
      const error = receivedPayable.value
      switch (error.constructor) {
        case PaginationError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      payables: receivedPayable.value.payables.map(PayablePresenter.toHTTP),
      payablesCount: receivedPayable.value.payablesCount,
    }
  }
}
