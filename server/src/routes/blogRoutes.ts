import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getNewsletters,
  createNewsletter,
  deleteNewsletter,
} from '../controllers/blogController';
import { authenticateJWT, requireRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Public blog routes
router.get('/', getBlogs);
router.get('/detail/:slug', getBlogBySlug);

// Protected blog routes (Any student or admin can post blogs)
router.post('/', authenticateJWT as any, createBlog as any);
router.put('/:blogId', authenticateJWT as any, updateBlog as any);
router.delete('/:blogId', authenticateJWT as any, deleteBlog as any);

// Newsletter routes
router.get('/newsletters', getNewsletters);
router.post('/newsletters', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, createNewsletter as any);
router.delete('/newsletters/:newsletterId', authenticateJWT as any, requireRoles(['super_admin', 'campus_admin']) as any, deleteNewsletter);

export default router;
