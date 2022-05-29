import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)

      const payload = {
        sub: user.id,
        username: user.username
      }

      const accessToken = jwt.sign(payload, JSON.parse(process.env.ACCESS_TOKEN_SECRET), {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      res.cookie('jwt', accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      res
        .status(201)
        .json({
          id: user.id
        })
    } catch (error) {
      const err = createError(401)
      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      })
      await user.save()

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
      console.log(error)
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.cause = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.cause = error
      }

      next(err)
    }
  }

  /**
   * Logs out.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      res.clearCookie('jwt')
      res.end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteAccount (req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      user.delete()
      res.clearCookie('jwt')
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }
}
