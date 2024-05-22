import { ServiceError } from '@/@shared/errors/service-error'

export class InactivePayableError extends Error implements ServiceError {
  constructor() {
    super(`Inactive payable error`)
  }
}
