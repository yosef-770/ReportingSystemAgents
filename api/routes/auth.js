import { Router } from 'express';
import { authJwt } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', authJwt, authController.me);

export default router;
