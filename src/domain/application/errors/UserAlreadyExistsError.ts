import { ServiceError } from '@/@shared/errors/service-error'

export class UserAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`User already exists`)
  }
}
