import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getEvents);
router.get('/:eventId', getEventById);

// Admin-only endpoints for managing events
router.post('/', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin', 'club_admin']) as any, createEvent);
router.put('/:eventId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin', 'club_admin']) as any, updateEvent);
router.delete('/:eventId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, deleteEvent);

export default router;
