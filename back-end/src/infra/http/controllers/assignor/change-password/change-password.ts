import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { WrongCredentialsError } from '@/domain/application/errors/wrong-credentials-error'
import { ChangePasswordService } from '@/domain/application/services/assignor/change-password'
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

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@ApiTags('assignor')
@Controller('/assignor/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', minLength: 8 },
        newPassword: { type: 'string', minLength: 8 },
      },
    },
    required: true,
    description: 'Password and new password',
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
    description: 'Error changing password',
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
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() assignor: UserPayload,
  ) {
    const { sub } = assignor

    const { password, newPassword } = body

    const editedAssignor = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedAssignor.isLeft()) {
      const error = editedAssignor.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new HttpException(error.message, 401)
        case AssignorNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(editedAssignor.value) }
  }
}
