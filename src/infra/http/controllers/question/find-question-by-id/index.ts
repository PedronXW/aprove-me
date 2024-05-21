import { findQuestionByIdService } from '@/infra/services/question/find-question-by-id'
import { FindQuestionByIdController } from './find-question-by-id-controller'

const findQuestionByIdController = new FindQuestionByIdController(
  findQuestionByIdService,
)

export { findQuestionByIdController }
