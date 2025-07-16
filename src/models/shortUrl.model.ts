import mongoose, { Document, Schema } from 'mongoose';

interface Click {
  timestamp: Date;
  referrer?: string;
  location?: string;
}

export interface IShortUrl extends Document {
  originalUrl: string;
  shortcode: string;
  createdAt: Date;
  expiresAt: Date;
  clickDetails: Click[];
}

const ClickSchema = new Schema<Click>({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const ShortUrlSchema = new Schema<IShortUrl>({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  clickDetails: [ClickSchema]
});

export const ShortUrl = mongoose.model<IShortUrl>('ShortUrl', ShortUrlSchema);
