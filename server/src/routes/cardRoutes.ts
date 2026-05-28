import express from 'express';
import { getCards, createCard, updateCard, deleteCard } from '../controllers/cardController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getCards);

// Admin-only endpoints for card editing, deleting, and adding information
router.post('/', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, createCard);
router.put('/:cardId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, updateCard);
router.delete('/:cardId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, deleteCard);

export default router;
