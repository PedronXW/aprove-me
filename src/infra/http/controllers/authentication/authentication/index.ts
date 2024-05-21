import { authenticateDeveloperService } from '@/infra/services/authentication/authentication'
import { AuthenticateUserController } from './authenticate-user-controller'

const authenticateDeveloperController = new AuthenticateUserController(
  authenticateDeveloperService,
)

export { authenticateDeveloperController }
