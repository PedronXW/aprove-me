import { updateQuestionService } from '@/infra/services/question/update-question'
import { UpdateQuestionController } from './update-question-controller'

const updateQuestionController = new UpdateQuestionController(
  updateQuestionService,
)

export { updateQuestionController }
