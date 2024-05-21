import { findAnswersByQuestionIdService } from '@/infra/services/answer/find-answer-by-question-id'
import { FindAnswersByQuestionIdController } from './find-answers-by-question-id-controller'

const findAnswersByQuestionIdController = new FindAnswersByQuestionIdController(
  findAnswersByQuestionIdService,
)

export { findAnswersByQuestionIdController }
