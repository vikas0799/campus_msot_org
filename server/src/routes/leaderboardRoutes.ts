import express from 'express';
import { getLeaderboard, syncStudentStats } from '../controllers/leaderboardController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getLeaderboard);
router.post('/sync', authenticateJWT as any, syncStudentStats as any);

export default router;
