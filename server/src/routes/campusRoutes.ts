import express from 'express';
import { getCampuses, getCampusBySlug, upsertCampus } from '../controllers/campusController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getCampuses);
router.get('/:slug', getCampusBySlug);
router.put('/:slug', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, upsertCampus);

export default router;
