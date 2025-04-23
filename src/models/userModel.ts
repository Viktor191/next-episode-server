import {Schema, Document, model} from 'mongoose';

interface IUser extends Document {
    username: string;
    password?: string; // <-- пароль может отсутствовать если пользователь зарегистрирован через Google
    email?: string;
    telegram?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String},
    email: {type: String, unique: true, sparse: true},
    telegram: {type: String, unique: true, sparse: true},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
});

export const UserModel = model<IUser>('UserModel', UserSchema, 'users');
