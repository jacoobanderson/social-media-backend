import { Messages } from '../../models/messages.js'

/**
 * Encapsulates a controller.
 */
export class MessagesController {
  /**
   * Gets all the messages.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
