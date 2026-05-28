import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  getUserPublicProfile,
  getAllUsers,
  updateUserRole,
} from '../controllers/authController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateJWT as any, getCurrentUser as any);
router.put('/profile/update', authenticateJWT as any, updateProfile as any);
router.get('/profile/:username', getUserPublicProfile);

// Admin-only endpoints
router.get('/users', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, getAllUsers);
router.put('/users/:userId/role', authenticateJWT as any, requireRoles(['super_admin']) as any, updateUserRole);

export default router;
