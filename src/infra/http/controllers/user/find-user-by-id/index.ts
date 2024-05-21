import { findUserByIdService } from '@/infra/services/user/find-user-by-id'
import { FindUserByIdController } from './find-user-by-id'

const findUserByIdController = new FindUserByIdController(findUserByIdService)

export { findUserByIdController }
