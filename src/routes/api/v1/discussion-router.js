import express from 'express'
import { DiscussionController } from '../../../controllers/api/discussion-controller.js'

export const router = express.Router()

const controller = new DiscussionController()

router.get('/all', (req, res, next) => controller.getDiscussions(req, res, next))
