import {Document, Schema, model} from "mongoose";

interface IShow extends Document {
    title: string;
    ids: string[];
}

const ShowSchema = new Schema<IShow>({
    title: {type: String},
    ids: {type: [String], required: true},
});

export const ShowModel = model<IShow>('ShowModel', ShowSchema, 'shows');