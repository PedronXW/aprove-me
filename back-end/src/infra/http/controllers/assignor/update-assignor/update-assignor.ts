import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { UpdateAssignorService } from '@/domain/application/services/assignor/update-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'

const updateAssignorDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  email: z.string().email().max(140).optional(),
  document: z.string().max(30).optional(),
  phone: z.string().max(20).optional(),
})

export type UpdateAssignorDTO = z.infer<typeof updateAssignorDTO>

const bodyValidation = new ZodValidationPipe(updateAssignorDTO)

@ApiTags('assignor')
@Controller('/assignor')
export class UpdateAssignorController {
  constructor(private updateAssignorService: UpdateAssignorService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 140 },
        email: { type: 'string', format: 'email', maxLength: 140 },
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
    description: 'Assignor updated',
    status: 200,
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error changing assignor',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: 401,
    type: ErrorDocsResponse,
  })
  @ApiForbiddenResponse({
    description: 'Assignor does not exist',
    status: 403,
    type: ErrorDocsResponse,
  })
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
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(updatedAssignor.value) }
  }
}
