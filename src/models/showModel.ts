import { Document, Schema, model } from 'mongoose';

interface IShow extends Document {
  tmdbId: string;
  type: 'tv' | 'movie';
  isNotified: boolean;
  userId: string;
  lastNotifiedSeason?: number;
}

const ShowSchema = new Schema<IShow>({
  tmdbId: { type: String, required: true },
  type: { type: String, enum: ['tv', 'movie'], required: true },
  isNotified: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
  lastNotifiedSeason: { type: Number, default: 0 },
});

export const ShowModel = model<IShow>('ShowModel', ShowSchema, 'favorites');
