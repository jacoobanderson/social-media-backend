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

router.get('/:id/friends', verifyJWT, (req, res, next) => controller.getFriends(req, res, next))
router.get('/:id/all', verifyJWT, (req, res, next) => controller.getAllUnmatchedUsers(req, res, next))
router.get('/:id/info', verifyJWT, (req, res, next) => controller.getUserData(req, res, next))
router.put('/:id/update', verifyJWT, (req, res, next) => controller.updateProfile(req, res, next))
router.put('/:id/friends/add', verifyJWT, (req, res, next) => controller.addFriend(req, res, next))
router.patch('/:id/friends/decline', verifyJWT, (req, res, next) => controller.saveMatchHistory(req, res, next, false))
router.patch('/:id/friends/accept', verifyJWT, (req, res, next) => controller.saveMatchHistory(req, res, next, true))
router.patch('/:id/friends/check', verifyJWT, (req, res, next) => controller.checkIfFriends(req, res, next))
