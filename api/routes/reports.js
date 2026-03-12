import { Router } from 'express';
import { authJwt, requireRole } from '../middleware/auth.js';
import * as reportsController from '../controllers/reportsController.js';

const router = Router();

router.use(authJwt, requireRole('admin', 'agent'));

router.get('/', reportsController.listReports);
router.get('/:id', reportsController.getReportById);
router.post('/', reportsController.createReport);
router.post('/csv', reportsController.importCsv);

export default router;
