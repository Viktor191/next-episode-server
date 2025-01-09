import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document { // Интерфейс для модели пользователя
    username: string;
    password: string;
}

const UserSchema = new Schema<IUser>({ // Схема для модели пользователя
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Модель пользователя в MongoDB
export const User = mongoose.model<IUser>('User', UserSchema, 'users_reg');

export interface ISomeData extends Document {
    name: string;
    age: number;
}

const SomeDataSchema = new Schema<ISomeData>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
});

export const SomeData = mongoose.model<ISomeData>('SomeData', SomeDataSchema, 'users_info');

export interface IShow extends Document {
    title: string;
    ids: string[];
}

const ShowSchema = new Schema<IShow>({
    title: { type: String },
    ids: { type: [String], required: true },
});

export const Show = mongoose.model<IShow>('Show', ShowSchema, 'shows');

