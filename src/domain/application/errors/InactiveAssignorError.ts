import { ServiceError } from '@/@shared/errors/service-error'

export class InactiveAssignorError extends Error implements ServiceError {
  constructor() {
    super(`Inactive assignor error`)
  }
}
