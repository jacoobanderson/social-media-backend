import express from 'express'
import { UserController } from '../../../controllers/api/user-controller.js'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export const router = express.Router()

const controller = new UserController()
/**
 * Verify user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} Returns the error.
 */
const verifyJWT = (req, res, next) => {
  try {
    const payload = jwt.verify(req.cookies.jwt, process.env.PUBLIC_SECRET)
    if (req.params.id !== payload.sub) {
      const err = createError(401)
      return next(err)
    }
    next()
  } catch (error) {
    const err = createError(401)
    next(err)
  }
}

router.get('/:id/info', verifyJWT, (req, res, next) => controller.getUserData(req, res, next))
router.put('/:id/update', verifyJWT, (req, res, next) => controller.updateProfile(req, res, next))
