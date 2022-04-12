import express from 'express'
import { AccountController } from '../../../controllers/api/account-controller.js'

export const router = express.Router()

const controller = new AccountController()

router.get('/logout', (req, res, next) => controller.logout(req, res, next))

router.post('/login', (req, res, next) => controller.login(req, res, next))

router.post('/register', (req, res, next) => controller.register(req, res, next))
