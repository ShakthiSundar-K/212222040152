import { ShortUrl } from '../models/shortUrl.model';
import { generateShortcode } from '../utils/generateShortcode';
import { log } from '../middleware/logger';
import { isValidUrl } from '../utils/isValidUrl';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export class ShortUrlService {
  async createShortUrl(originalUrl: string, validity?: number, customCode?: string) {
    if (!isValidUrl(originalUrl)) {
      await log('backend', 'error', 'service', `Invalid URL format: ${originalUrl}`);
      throw { status: 400, message: 'Invalid URL format' };
    }

    const shortcode = customCode || generateShortcode();

    const exists = await ShortUrl.findOne({ shortcode });
    if (exists) {
      await log('backend', 'warn', 'service', `Shortcode already exists: ${shortcode}`);
      throw { status: 409, message: 'Shortcode already exists' };
    }

    const expiresAt = new Date(Date.now() + (validity || 30) * 60000);

    const shortUrl = new ShortUrl({
      originalUrl,
      shortcode,
      expiresAt
    });

    await shortUrl.save();
    await log('backend', 'info', 'service', `Short URL created: ${shortcode}`);

    return {
      shortLink: `${BASE_URL}/${shortcode}`,
      expiry: expiresAt
    };
  }

  async getAndRedirect(shortcode: string, referrer?: string) {
    const entry = await ShortUrl.findOne({ shortcode });
    if (!entry) {
      await log('backend', 'error', 'service', `Shortcode not found: ${shortcode}`);
      throw { status: 404, message: 'Shortcode not found' };
    }

    if (new Date() > entry.expiresAt) {
      await log('backend', 'warn', 'service', `Shortlink expired: ${shortcode}`);
      throw { status: 410, message: 'Shortlink expired' };
    }

    entry.clickDetails.push({
      timestamp: new Date(),
      referrer,
      location: 'India' // Mocked location
    });

    await entry.save();
    await log('backend', 'info', 'service', `Shortcode clicked: ${shortcode}`);

    return entry.originalUrl;
  }

  async getStatistics(shortcode: string) {
    const entry = await ShortUrl.findOne({ shortcode });
    if (!entry) {
      await log('backend', 'error', 'service', `Stats requested for unknown shortcode: ${shortcode}`);
      throw { status: 404, message: 'Shortcode not found' };
    }

    await log('backend', 'info', 'service', `Statistics retrieved for: ${shortcode}`);

    return {
      clicks: entry.clickDetails.length,
      originalUrl: entry.originalUrl,
      createdAt: entry.createdAt,
      expiry: entry.expiresAt,
      clickDetails: entry.clickDetails
    };
  }
}
