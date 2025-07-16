import express from 'express';
import {
  createShortUrl,
  redirectShortUrl,
  getShortUrlStats
} from '../controllers/shortUrl.controller';

const router = express.Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectShortUrl); // MUST be last

export default router;
