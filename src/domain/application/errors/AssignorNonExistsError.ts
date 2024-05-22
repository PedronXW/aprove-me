import { ServiceError } from '@/@shared/errors/service-error'

export class AssignorNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Assignor non exists`)
  }
}
