import express from 'express'
import { MessagesController } from '../../../controllers/api/messages-controller.js'

export const router = express.Router()

const controller = new MessagesController()

router.get('/:id', (req, res, next) => controller.getMessages(req, res, next))
