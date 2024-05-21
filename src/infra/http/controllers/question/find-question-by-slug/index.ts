import { findQuestionBySlugService } from '@/infra/services/question/find-question-by-slug'
import { FindQuestionBySlugController } from './find-question-by-slug-controller'

const findQuestionBySlugController = new FindQuestionBySlugController(
  findQuestionBySlugService,
)

export { findQuestionBySlugController }
