import { deleteQuestionService } from '@/infra/services/question/delete-question'
import { DeleteQuestionController } from './delete-question-controller'

const deleteQuestionController = new DeleteQuestionController(
  deleteQuestionService,
)

export { deleteQuestionController }
