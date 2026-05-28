import express from 'express';
import { getCommunities, getCommunityBySlug, upsertCommunity } from '../controllers/communityController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getCommunities);
router.get('/:slug', getCommunityBySlug);
router.put('/:slug', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, upsertCommunity);

export default router;
