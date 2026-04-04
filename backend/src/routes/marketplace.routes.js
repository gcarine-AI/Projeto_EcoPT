import { Router } from 'express';
import auth from '../middleware/auth.js';
import { list, create, update, remove, interest, myItems } from '../controllers/marketplace.controller.js';

const router = Router();

router.get('/', auth, list);
router.get('/my-items', auth, myItems);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.patch('/:id/interest', auth, interest);

export default router;