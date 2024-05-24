import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { UpdateAssignorService } from '@/domain/application/services/assignor/update-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Body, Controller, Patch } from '@nestjs/common'
import { z } from 'zod'

const updateAssignorDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  email: z.string().email().max(140).optional(),
  document: z.string().max(30).optional(),
  phone: z.string().max(20).optional(),
})

export type UpdateAssignorDTO = z.infer<typeof updateAssignorDTO>

const bodyValidation = new ZodValidationPipe(updateAssignorDTO)

@Controller('/assignor')
export class UpdateAssignorController {
  constructor(private updateAssignorService: UpdateAssignorService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: UpdateAssignorDTO,
    @CurrentUser() assignor: UserPayload,
  ) {
    const { name, email, document, phone } = body

    const { sub } = assignor

    const updatedAssignor = await this.updateAssignorService.execute({
      id: sub,
      name,
      email,
      document,
      phone,
    })

    if (updatedAssignor.isLeft()) {
      const error = updatedAssignor.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(updatedAssignor.value) }
  }
}
