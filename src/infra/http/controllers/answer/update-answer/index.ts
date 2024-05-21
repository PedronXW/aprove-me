import { updateAnswerService } from '@/infra/services/answer/update-answer'
import { UpdateAnswerController } from './update-answer-controller'

const updateAnswerController = new UpdateAnswerController(updateAnswerService)

export { updateAnswerController }
