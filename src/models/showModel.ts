import {Document, Schema} from "mongoose";
import mongoose from "mongoose";

export interface IShow extends Document {
    title: string;
    ids: string[];
}

const ShowSchema = new Schema<IShow>({
    title: { type: String },
    ids: { type: [String], required: true },
});

export const Show = mongoose.model<IShow>('Show', ShowSchema, 'shows');

