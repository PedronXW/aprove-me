import { createQuestionService } from '@/infra/services/question/create-question'
import { CreateQuestionController } from './create-question-controller'

const createQuestionController = new CreateQuestionController(
  createQuestionService,
)

export { createQuestionController }
