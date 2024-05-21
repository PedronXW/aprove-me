import { Router } from 'express'
import { changePasswordController } from '../controllers/user/change-password'
import { createUserController } from '../controllers/user/create-user'
import { deleteUserController } from '../controllers/user/delete-user'
import { editUserController } from '../controllers/user/edit-user'
import { findUserByIdController } from '../controllers/user/find-user-by-id'
import { verifyAuthentication } from '../middlewares/verifyAuthentication'

const usersRouter = Router()

usersRouter.put('/password', verifyAuthentication, (req, res) => {
  return changePasswordController.handle(req, res)
})

usersRouter.post('/', (req, res) => {
  return createUserController.handle(req, res)
})

usersRouter.delete('/', verifyAuthentication, (req, res) => {
  return deleteUserController.handle(req, res)
})

usersRouter.put('/', verifyAuthentication, (req, res) => {
  return editUserController.handle(req, res)
})

usersRouter.get('/', verifyAuthentication, (req, res) => {
  return findUserByIdController.handle(req, res)
})

export { usersRouter }
