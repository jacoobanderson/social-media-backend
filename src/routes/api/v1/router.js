import express from 'express'
import { router as accountRouter } from './account-router.js'
import { router as userRouter } from './user-router.js'
import { router as messagesRouter } from './messages-router.js'

export const router = express.Router()
router.use('/', accountRouter)
router.use('/user', userRouter)
router.use('/messages', messagesRouter)
