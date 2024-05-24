import { ServiceError } from '@/@shared/errors/service-error'

export class AssignorAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Assignor already exists`)
  }
}
