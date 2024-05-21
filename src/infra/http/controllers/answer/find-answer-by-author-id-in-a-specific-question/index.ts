import { findAnswerByAuthorIdInASpecificQuestionService } from '@/infra/services/answer/find-answer-by-author-id-in-a-specific-question'
import { FindAnswerByAuthorIdInASpecificQuestionController } from './find-answer-by-author-id-in-a-specific-question'

const findAnswerByAuthorIdInASpecificQuestionController =
  new FindAnswerByAuthorIdInASpecificQuestionController(
    findAnswerByAuthorIdInASpecificQuestionService,
  )

export { findAnswerByAuthorIdInASpecificQuestionController }
