import { CreateAssignorService } from '@/domain/application/services/assignor/create-assignor'
import { Public } from '@/infra/auth/public'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
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

@ApiTags('assignor')
@Public()
@Controller('/assignor')
export class CreateAssignorController {
  constructor(private createAssignorService: CreateAssignorService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 140 },
        email: { type: 'string', format: 'email', maxLength: 140 },
        password: { type: 'string', minLength: 8 },
        document: { type: 'string', maxLength: 30 },
        phone: { type: 'string', maxLength: 20 },
      },
      required: ['name', 'email', 'password', 'document', 'phone'],
      description: 'Name, email, password, document and phone',
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        assignor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', maxLength: 140 },
            email: { type: 'string', maxLength: 140 },
            document: { type: 'string', maxLength: 30 },
            phone: { type: 'string', maxLength: 20 },
            active: { type: 'boolean' },
          },
        },
      },
    },
    description: 'Assignor created',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Error creating assignor',
    status: 400,
    type: ErrorDocsResponse,
  })
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
          throw new HttpException('Error creating assignor', 400)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(assignor.value) }
  }
}
