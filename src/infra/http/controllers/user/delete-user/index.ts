import { deleteUserService } from '@/infra/services/user/delete-user'
import { DeleteUserController } from './delete-user'

const deleteUserController = new DeleteUserController(deleteUserService)

export { deleteUserController }
