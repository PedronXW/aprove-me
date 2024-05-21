import { ServiceError } from '@/@shared/errors/service-error'

export class InactiveUserError extends Error implements ServiceError {
  constructor() {
    super('User is inactive')
  }
}
