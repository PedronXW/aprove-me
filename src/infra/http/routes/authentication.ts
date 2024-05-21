import { Router } from 'express'
import { authenticateDeveloperController } from '../controllers/authentication/authentication'
import { resetUserPasswordController } from '../controllers/authentication/reset-user-password'
import { sendResetPasswordController } from '../controllers/authentication/send-reset-password'

const authenticationRoutes = Router()

authenticationRoutes.post('/', (req, res) => {
  return authenticateDeveloperController.handle(req, res)
})

authenticationRoutes.put('/reset-password', (req, res) => {
  return resetUserPasswordController.handle(req, res)
})

authenticationRoutes.post('/reset-password', (req, res) => {
  return sendResetPasswordController.handle(req, res)
})

export { authenticationRoutes }
