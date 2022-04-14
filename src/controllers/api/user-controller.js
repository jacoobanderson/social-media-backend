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
      res.status(201).json({
        id: user.id,
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        programming: user.programming,
        goals: user.goals,
        description: user.description,
        school: user.school,
        location: user.location
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Updates user profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updateProfile (req, res, next) {
    try {
      const user = await User.findById(req.params.id)

      await user.update({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        programming: req.body.programming,
        goals: req.body.goals,
        description: req.body.description,
        school: req.body.school,
        location: req.body.location
      })
      res.status(204).end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
