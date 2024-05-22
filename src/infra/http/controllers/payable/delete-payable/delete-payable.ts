import { InactivePayableError } from '@/domain/application/errors/InactivePayableError'
import { PayableNonExistsError } from '@/domain/application/errors/PayableNonExists'
import { DeletePayableService } from '@/domain/application/services/payable/delete-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/payables')
export class DeletePayableController {
  constructor(private deletePayableService: DeletePayableService) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deletePayableService.execute({
      id,
      receiverId: sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new BadRequestException(error.message)
        case InactivePayableError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
