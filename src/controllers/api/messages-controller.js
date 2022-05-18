import { Messages } from '../../models/messages.js'

/**
 * Encapsulates a controller.
 */
export class MessagesController {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getMessages (req, res, next) {
    try {
      const messages = await Messages.findOne({ room: req.params.id })
      if (messages) {
        res.json(messages?.messages)
      } else {
        res.json({ messages: 'none' })
      }
    } catch (error) {
      next(error)
    }
  }
}
