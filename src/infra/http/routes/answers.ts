import { Router } from 'express'
import { createAnswerController } from '../controllers/answer/create-answer'
import { deleteAnswerController } from '../controllers/answer/delete-answer'
import { findAnswerByAuthorIdInASpecificQuestionController } from '../controllers/answer/find-answer-by-author-id-in-a-specific-question'
import { findAnswerByIdController } from '../controllers/answer/find-answer-by-id'
import { findAnswersByQuestionIdController } from '../controllers/answer/find-answers-by-question-id'
import { updateAnswerController } from '../controllers/answer/update-answer'
import { verifyAuthentication } from '../middlewares/verifyAuthentication'

const answersRouter = Router()

answersRouter.post('/', verifyAuthentication, (req, res) => {
  return createAnswerController.handle(req, res)
})

answersRouter.patch('/:id', verifyAuthentication, (req, res) => {
  return updateAnswerController.handle(req, res)
})

answersRouter.get(
  '/question/:id/specific',
  verifyAuthentication,
  (req, res) => {
    return findAnswerByAuthorIdInASpecificQuestionController.handle(req, res)
  },
)

answersRouter.get('/question/:id', verifyAuthentication, (req, res) => {
  return findAnswersByQuestionIdController.handle(req, res)
})

answersRouter.get('/:id', verifyAuthentication, (req, res) => {
  return findAnswerByIdController.handle(req, res)
})

answersRouter.delete('/:id', verifyAuthentication, (req, res) => {
  return deleteAnswerController.handle(req, res)
})

export { answersRouter }
