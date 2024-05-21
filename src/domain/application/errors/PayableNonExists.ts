import { ServiceError } from '@/@shared/errors/service-error'

export class PayableNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Payable non exists`)
  }
}
