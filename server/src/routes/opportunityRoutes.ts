import express from 'express';
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleBookmark,
  getBookmarkedOpportunities,
} from '../controllers/opportunityController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getOpportunities);
router.get('/:opportunityId', getOpportunityById);

// Protected routes (Student bookmarking)
router.get('/bookmarks/all', authenticateJWT as any, getBookmarkedOpportunities as any);
router.post('/:opportunityId/bookmark', authenticateJWT as any, toggleBookmark as any);

// Admin-only endpoints for managing opportunities
router.post('/', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, createOpportunity);
router.put('/:opportunityId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, updateOpportunity);
router.delete('/:opportunityId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, deleteOpportunity);

export default router;
