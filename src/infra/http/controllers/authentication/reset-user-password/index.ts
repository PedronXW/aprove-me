import { resetUserPasswordService } from '@/infra/services/authentication/reset-user-password'
import { ResetUserPasswordController } from './reset-user-password'

const resetUserPasswordController = new ResetUserPasswordController(
  resetUserPasswordService,
)

export { resetUserPasswordController }
