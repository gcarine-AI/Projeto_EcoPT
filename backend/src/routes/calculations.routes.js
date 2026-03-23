import { Router } from 'express'
import auth from '../middleware/auth.js'
import { create, list, getOne, update, remove, compare } from '../controllers/calculations.controller.js'

const router = Router()

router.use(auth)  // todas as rotas de cálculos precisam de autenticação

router.post('/', create)
router.get('/', list)
router.get('/compare', compare)
router.get('/:id', getOne)
router.put('/:id', update)
router.delete('/:id', remove)

export default router