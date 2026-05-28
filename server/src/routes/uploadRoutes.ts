import express from 'express';
import upload, { handleUpload } from '../utils/uploader';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateJWT as any, upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const imageUrl = await handleUpload(req, req.file);
    res.status(200).json({ imageUrl });
  } catch (error: any) {
    console.error('Upload route error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

export default router;
