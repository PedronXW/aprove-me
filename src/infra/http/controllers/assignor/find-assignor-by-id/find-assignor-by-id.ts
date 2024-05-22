import { AssignorNonExistsError } from '@/domain/application/errors/AssignorNonExistsError'
import { FindAssignorByIdService } from '@/domain/application/services/assignor/find-assignor-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

@Controller('/assignors')
export class FindAssignorByIdController {
  constructor(
    private readonly findAssignorByIdService: FindAssignorByIdService,
  ) {}

  @Get('/:id')
  async handle(@Param('id') id: string, @CurrentUser() assignor: UserPayload) {
    const { sub } = assignor

    const receivedAssignor = await this.findAssignorByIdService.execute({
      id,
      creatorId: sub,
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
