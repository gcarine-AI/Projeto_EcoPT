import { Router } from 'express'
import { calculate } from '../controllers/carsharing.controller.js'
import auth from '../middleware/auth.js'

const router = Router()

router.post('/calculate', auth, calculate)

export default router