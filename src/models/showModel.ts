import {Document, Schema, model} from "mongoose";

interface IShow extends Document {
    tmdbId: string;
    type: "tv" | "movie";
    isNotified: boolean;
    userId: string; // Ссылка на идентификатор пользователя
}

const ShowSchema = new Schema<IShow>({
    tmdbId: {type: String, required: true},
    type: {type: String, enum: ["tv", "movie"], required: true},
    isNotified: {type: Boolean, required: true, default: false},
    userId: {type: String, required: true}, // Добавляем поле userId
});

export const ShowModel = model<IShow>("ShowModel", ShowSchema, "favorites");