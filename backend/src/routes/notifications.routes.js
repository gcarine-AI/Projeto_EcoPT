import { Router } from 'express';
import auth from '../middleware/auth.js';
import { list, markRead } from '../controllers/notifications.controller.js';

const router = Router();

router.get('/', auth, list);
router.patch('/read', auth, markRead);

export default router;