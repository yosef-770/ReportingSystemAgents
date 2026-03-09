import { Router } from 'express';
import { authJwt, requireRole } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.use(authJwt, requireRole('admin'));

router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);

export default router;
