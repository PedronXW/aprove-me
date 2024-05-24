import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { InactiveAssignorError } from '@/domain/application/errors/inactive-assignor-error'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createPayableDTO = z.object({
  value: z.number(),
  emissionDate: z.string(),
})

export type CreatePayableDTO = z.infer<typeof createPayableDTO>

const bodyValidation = new ZodValidationPipe(createPayableDTO)

@Controller('/payable')
export class CreatePayableController {
  constructor(private createPayableService: CreatePayableService) {}

  @Post()
  async handle(
    @Body(bodyValidation) body: CreatePayableDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { value, emissionDate } = body

    const { sub } = user

    const payable = await this.createPayableService.execute({
      assignorId: sub,
      value,
      emissionDate: new Date(emissionDate),
    })

    if (payable.isLeft()) {
      const error = payable.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        case InactiveAssignorError:
          throw new BadRequestException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    return { payable: PayablePresenter.toHTTP(payable.value) }
  }
}
