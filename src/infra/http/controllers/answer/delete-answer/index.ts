import { deleteAnswerService } from '@/infra/services/answer/delete-answer'
import { DeleteAnswerController } from './delete-answer-controller'

const deleteAnswerController = new DeleteAnswerController(deleteAnswerService)

export { deleteAnswerController }
