import { Router } from 'express'
import { createQuestionController } from '../controllers/question/create-question'
import { deleteQuestionController } from '../controllers/question/delete-question'
import { findAllQuestionController } from '../controllers/question/find-all-questions'
import { findQuestionByIdController } from '../controllers/question/find-question-by-id'
import { findQuestionBySlugController } from '../controllers/question/find-question-by-slug'
import { updateQuestionController } from '../controllers/question/update-question'
import { verifyAuthentication } from '../middlewares/verifyAuthentication'

const questionsRoutes = Router()

questionsRoutes.post('/', verifyAuthentication, (req, res) => {
  return createQuestionController.handle(req, res)
})

questionsRoutes.get('/slug/:slug', verifyAuthentication, (req, res) => {
  return findQuestionBySlugController.handle(req, res)
})

questionsRoutes.get('/:id', verifyAuthentication, (req, res) => {
  return findQuestionByIdController.handle(req, res)
})

questionsRoutes.get('/', verifyAuthentication, (req, res) => {
  return findAllQuestionController.handle(req, res)
})

questionsRoutes.patch('/:id', verifyAuthentication, (req, res) => {
  return updateQuestionController.handle(req, res)
})

questionsRoutes.delete('/:id', verifyAuthentication, (req, res) => {
  return deleteQuestionController.handle(req, res)
})

export { questionsRoutes }
