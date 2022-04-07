import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Gets userData.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserData (req, res, next) {
    try {
      const user = await User.findById(req.body.userId)
      res
        .status(201)
        .json({
          id: user.id,
          username: user.username,
          firstname: user.firstName,
          lastname: user.lastName
        })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sets the id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
     async setId (req, res, next, id) {
        try {
          req.id = id
          next()
        } catch (error) {
          next(error)
        }
}
}