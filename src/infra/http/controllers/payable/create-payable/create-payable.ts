import { AssignorNonExistsError } from '@/domain/application/errors/AssignorNonExistsError'
import { InactiveAssignorError } from '@/domain/application/errors/InactiveAssignorError'
import { InactiveUserError } from '@/domain/application/errors/InactiveUserError'
import { UserNonExistsError } from '@/domain/application/errors/UserNonExists'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createPayableDTO = z.object({
  value: z.number(),
  emissionDate: z.date(),
  assignorId: z.string().uuid(),
})

export type CreatePayableDTO = z.infer<typeof createPayableDTO>

const bodyValidation = new ZodValidationPipe(createPayableDTO)

@Controller('/payables')
export class CreatePayableController {
  constructor(private createPayableService: CreatePayableService) {}

  @Post()
  async handle(
    @Body(bodyValidation) body: CreatePayableDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { assignorId, emissionDate, value } = body

    const { sub } = user

    const payable = await this.createPayableService.execute({
      assignorId,
      emissionDate,
      receiverId: sub,
      value,
    })

    if (payable.isLeft()) {
      const error = payable.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        case InactiveAssignorError:
          throw new BadRequestException(error.message)
        case InactiveUserError:
          throw new BadRequestException(error.message)
        case UserNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return PayablePresenter.toHTTP(payable.value)
  }
}
