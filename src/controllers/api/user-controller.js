import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Gets user data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserData (req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      res
        .status(201)
        .json({
          id: user.id,
          username: user.username,
          firstname: user.firstName,
          lastname: user.lastName
        })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
