import { Request, Response, NextFunction } from 'express';
import { ShortUrlService } from '../services/shortUrl.service';
import { log } from '../middleware/logger';

const shortUrlService = new ShortUrlService();

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url) {
      await log('backend', 'error', 'controller', 'URL is required in request body');
      throw { status: 400, message: 'URL is required' };
    }

    const result = await shortUrlService.createShortUrl(url, validity, shortcode);
    await log('backend', 'info', 'controller', `Short URL created for ${url}`);
    res.status(201).json(result);
  } catch (err) {
    await log('backend', 'error', 'controller', err.message || 'Failed to create short URL');
    next(err);
  }
};

export const redirectShortUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const referrer = req.get('Referrer');

    const originalUrl = await shortUrlService.getAndRedirect(shortcode, referrer);
    await log('backend', 'info', 'controller', `Redirecting shortcode ${shortcode}`);
    res.redirect(302, originalUrl);
  } catch (err) {
    await log('backend', 'error', 'controller', err.message || 'Redirection failed');
    next(err);
  }
};

export const getShortUrlStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const stats = await shortUrlService.getStatistics(shortcode);
    await log('backend', 'info', 'controller', `Stats fetched for shortcode ${shortcode}`);
    res.status(200).json(stats);
  } catch (err) {
    await log('backend', 'error', 'controller', err.message || 'Failed to get stats');
    next(err);
  }
};
