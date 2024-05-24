import { WrongCredentialsError } from '@/domain/application/errors/wrong-credentials-error'
import { AuthenticateAssignorService } from '@/domain/application/services/assignor/authenticate-assignor'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const authenticateAssignorDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateAssignorDTO = z.infer<typeof authenticateAssignorDTO>

@Public()
@Controller('/session')
export class AuthenticateAssignorController {
  constructor(
    private authenticateAssignorService: AuthenticateAssignorService,
  ) {}

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
