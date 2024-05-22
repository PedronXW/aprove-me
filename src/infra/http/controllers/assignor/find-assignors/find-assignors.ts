import { PaginationError } from '@/domain/application/errors/PaginationError'
import { FindAssignorsService } from '@/domain/application/services/assignor/find-assignors'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

@Controller('/assignors')
export class FindAssignorsController {
  constructor(private readonly findAssignorsService: FindAssignorsService) {}

  @Get()
  async handle(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() assignor: UserPayload,
  ) {
    const { sub } = assignor

    const receivedAssignor = await this.findAssignorsService.execute({
      limit,
      page,
      creatorId: sub,
    })

    if (receivedAssignor.isLeft()) {
      const error = receivedAssignor.value
      switch (error.constructor) {
        case PaginationError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      assignors: receivedAssignor.value.assignors.map(AssignorPresenter.toHTTP),
      assignorsCount: receivedAssignor.value.assignorsCount,
    }
  }
}
