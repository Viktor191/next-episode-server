import {Schema, Document, model} from 'mongoose';

interface IUser extends Document {
    username: string;
    password?: string; // <-- теперь TypeScript знает, что пароль может отсутствовать
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String},
});

export const UserModel = model<IUser>('UserModel', UserSchema, 'users');
