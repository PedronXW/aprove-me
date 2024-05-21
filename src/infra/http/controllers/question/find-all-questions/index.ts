import { findAllQuestionsService } from '@/infra/services/question/find-all-questions'
import { FindAllQuestionsController } from './find-all-questions-controller'

const findAllQuestionController = new FindAllQuestionsController(
  findAllQuestionsService,
)

export { findAllQuestionController }
