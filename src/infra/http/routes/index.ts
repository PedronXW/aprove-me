import { Router } from 'express'
import { answersRouter } from './answers'
import { authenticationRoutes } from './authentication'
import { questionsRoutes } from './questions'
import { usersRouter } from './users'

const router = Router()

router.use('/sessions', authenticationRoutes)

router.use('/users', usersRouter)

router.use('/questions', questionsRoutes)

router.use('/answers', answersRouter)

export { router }
