import { findAnswerByIdService } from '@/infra/services/answer/find-answer-by-id'
import { FindAnswerByIdController } from './find-answer-by-id-controller'

const findAnswerByIdController = new FindAnswerByIdController(
  findAnswerByIdService,
)

export { findAnswerByIdController }
