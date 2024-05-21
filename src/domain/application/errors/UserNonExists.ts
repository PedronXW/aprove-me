import { ServiceError } from '@/@shared/errors/service-error'

export class UserNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`User non exists`)
  }
}
