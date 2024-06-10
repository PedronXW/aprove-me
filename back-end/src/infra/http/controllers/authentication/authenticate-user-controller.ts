import { WrongCredentialsError } from '@/domain/application/errors/wrong-credentials-error'
import { AuthenticateAssignorService } from '@/domain/application/services/assignor/authenticate-assignor'
import { Public } from '@/infra/auth/public'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { TokenDocsResponse } from '@/infra/documentation/responses/token-docs-response'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const authenticateAssignorDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateAssignorDTO = z.infer<typeof authenticateAssignorDTO>

@ApiTags('session')
@Public()
@Controller('/session')
export class AuthenticateAssignorController {
  constructor(
    private authenticateAssignorService: AuthenticateAssignorService,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
      },
      required: ['email', 'password'],
      description: 'Email and password',
    },
  })
  @ApiOkResponse({
    type: TokenDocsResponse,
    description: 'Session created',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Error creating a session',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: 401,
    type: ErrorDocsResponse,
  })
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAssignorDTO))
  async handle(@Body() body: AuthenticateAssignorDTO) {
    const { email, password } = body

    const token = await this.authenticateAssignorService.execute({
      email,
      password,
    })

    if (token.isLeft()) {
      const error = token.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { token: token.value.token }
  }
}
