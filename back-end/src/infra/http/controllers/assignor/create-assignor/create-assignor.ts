import { CreateAssignorService } from '@/domain/application/services/assignor/create-assignor'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createAssignorDTO = z.object({
  name: z.string().min(2).max(140),
  email: z.string().email().max(140),
  password: z.string().min(8),
  document: z.string().max(30),
  phone: z.string().max(20),
})

export type CreateAssignorDTO = z.infer<typeof createAssignorDTO>

const bodyValidation = new ZodValidationPipe(createAssignorDTO)

@Public()
@Controller('/assignor')
export class CreateAssignorController {
  constructor(private createAssignorService: CreateAssignorService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateAssignorDTO) {
    const { document, name, email, phone, password } = body

    const assignor = await this.createAssignorService.execute({
      name,
      email,
      document,
      password,
      phone,
    })

    if (assignor.isLeft()) {
      const error = assignor.value
      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(assignor.value) }
  }
}
