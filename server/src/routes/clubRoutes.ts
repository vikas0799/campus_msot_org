import express from 'express';
import {
  getClubs,
  getClubBySlug,
  createClub,
  updateClub,
  deleteClub,
  toggleClubMembership,
} from '../controllers/clubController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getClubs);
router.get('/detail/:campus/:slug', getClubBySlug);

// Protected routes
router.post('/:clubId/join', authenticateJWT as any, toggleClubMembership as any);

// Admin-only endpoints for managing clubs
router.post('/', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin', 'club_admin']) as any, createClub);
router.put('/:clubId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin', 'club_admin']) as any, updateClub);
router.delete('/:clubId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, deleteClub);

export default router;
