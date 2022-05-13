import createError from 'http-errors'
import { Messages } from '../../models/messages.js'

/**
 * Encapsulates a controller.
 */
export class MessagesController {
    async getMessages(req, res, next) {
        const messages = await Messages.findOne({ room: req.params.id })
        res.json(messages?.messages)
    }
}
