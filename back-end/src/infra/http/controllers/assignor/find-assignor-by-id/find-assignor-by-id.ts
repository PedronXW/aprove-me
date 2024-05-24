import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { FindAssignorByIdService } from '@/domain/application/services/assignor/find-assignor-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('/assignor')
export class FindAssignorByIdController {
  constructor(
    private readonly findAssignorByIdService: FindAssignorByIdService,
  ) {}

  @Get()
  async handle(@CurrentUser() assignor: UserPayload) {
    const { sub } = assignor

    const receivedAssignor = await this.findAssignorByIdService.execute({
      id: sub,
    })

    if (receivedAssignor.isLeft()) {
      const error = receivedAssignor.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(receivedAssignor.value) }
  }
}
