import { Schema, Document, model } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const UserModel = model<IUser>('UserModel', UserSchema, 'users');
