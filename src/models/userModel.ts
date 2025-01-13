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
export const User = mongoose.model<IUser>('User', UserSchema, 'users');
