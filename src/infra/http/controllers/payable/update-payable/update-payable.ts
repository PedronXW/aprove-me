import { PayableNonExistsError } from '@/domain/application/errors/PayableNonExists'
import { UpdatePayableService } from '@/domain/application/services/payable/update-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'

const updatePayableDTO = z.object({
  value: z.number(),
  emissionDate: z.date(),
  assignorId: z.string().uuid(),
})

export type UpdatePayableDTO = z.infer<typeof updatePayableDTO>

const bodyValidation = new ZodValidationPipe(updatePayableDTO)

@Controller('/payables')
export class UpdatePayableController {
  constructor(private updatePayableService: UpdatePayableService) {}

  @Patch('/:id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) body: UpdatePayableDTO,
    @CurrentUser() payable: UserPayload,
  ) {
    const { value, assignorId, emissionDate } = body

    const { sub } = payable

    const updatedPayable = await this.updatePayableService.execute({
      receiverId: sub,
      id,
      value,
      assignorId,
      emissionDate,
    })

    if (updatedPayable.isLeft()) {
      const error = updatedPayable.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return PayablePresenter.toHTTP(updatedPayable.value)
  }
}
