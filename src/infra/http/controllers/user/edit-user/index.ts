import { editUserService } from '@/infra/services/user/edit-user'
import { EditUserController } from './edit-user'

const editUserController = new EditUserController(editUserService)

export { editUserController }
