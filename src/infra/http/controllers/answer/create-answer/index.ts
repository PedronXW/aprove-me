import { createAnswerService } from '@/infra/services/answer/create-answer'
import { CreateAnswerController } from './create-answer-controller'

const createAnswerController = new CreateAnswerController(createAnswerService)

export { createAnswerController }
