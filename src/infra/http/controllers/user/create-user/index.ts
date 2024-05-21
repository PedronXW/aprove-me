import { createUserService } from '@/infra/services/user/create-user'
import { CreateUserController } from './create-user'

const createUserController = new CreateUserController(createUserService)

export { createUserController }
