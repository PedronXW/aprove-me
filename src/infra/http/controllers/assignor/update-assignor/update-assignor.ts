import { AssignorNonExistsError } from '@/domain/application/errors/AssignorNonExistsError'
import { UpdateAssignorService } from '@/domain/application/services/assignor/update-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'

const updateAssignorDTO = z.object({
  name: z.string().min(2).max(140),
  email: z.string().email().max(140),
  document: z.string().max(30),
  phone: z.string().max(20),
})

export type UpdateAssignorDTO = z.infer<typeof updateAssignorDTO>

const bodyValidation = new ZodValidationPipe(updateAssignorDTO)

@Controller('/assignors')
export class UpdateAssignorController {
  constructor(private updateAssignorService: UpdateAssignorService) {}

  @Patch('/:id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) body: UpdateAssignorDTO,
    @CurrentUser() assignor: UserPayload,
  ) {
    const { name, email, document, phone } = body

    const { sub } = assignor

    const updatedAssignor = await this.updateAssignorService.execute({
      creatorId: sub,
      id,
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

    return AssignorPresenter.toHTTP(updatedAssignor.value)
  }
}
