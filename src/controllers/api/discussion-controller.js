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

    /**
   *
   * @param req
   * @param res
   * @param next
   */
     async addComment (req, res, next) {
        try {
          const discussion = await Discussion.findById(req.body.id)
          console.log(await discussion)
            discussion?.replies.push({
                owner: req.body.owner,
                content: req.body.content
            })

          await discussion.save()
          res.status(200).end()
        } catch (error) {
            console.log(error)
          next(error)
        }
      }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async createDiscussion (req, res, next) {
    try {
      const discussion = new Discussion({
        title: req.body.title,
        owner: req.body.owner,
        content: req.body.content
      })
      await discussion.save()

      res
        .status(201)
        .json({ id: discussion.id })
    } catch (error) {
      next(error)
    }
  }
}
