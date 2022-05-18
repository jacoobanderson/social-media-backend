import { Discussion } from '../../models/discussion.js'

/**
 * Encapsulates a controller.
 */
export class DiscussionController {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getDiscussions (req, res, next) {
    try {
      const discussions = await Discussion.find({})
      if (discussions) {
        res.json(discussions)
      } else {
        res.json({ status: 'no current discussions' })
      }
    } catch (error) {
      next(error)
    }
  }
}