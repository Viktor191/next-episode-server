import {Request, Response} from "express";
import {UserModel} from "models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from "zod";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {error as logError, info} from "helpers/logger";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const userInputSchema = z.object({
    username: z
        .string()
        .min(3, "Имя пользователя должно содержать минимум 3 символа")
        .max(30, "Имя пользователя не может превышать 30 символов"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const parsedInput = userInputSchema.parse(req.body);
        const {username, password} = parsedInput;

        const existingUser = await UserModel.findOne({username});
        if (existingUser) {
            res.status(400).json({error: 'Пользователь с таким именем уже существует'});
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        await new UserModel({username, password: hashedPassword}).save();

        res.status(201).json({message: 'Пользователь зарегистрирован'});
    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
            res.status(400).json({error: err.errors.map(e => e.message).join(', ')});
        } else if (err instanceof Error) {
            logError('Ошибка регистрации:', err.message);
            res.status(500).json({error: 'Ошибка сервера'});
        } else {
            logError('Неизвестная ошибка при регистрации:', err);
            res.status(500).json({error: 'Ошибка сервера'});
        }
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const parsedInput = userInputSchema.parse(req.body);
        const {username, password} = parsedInput;

        const user = await UserModel.findOne({username});
        if (!user) {
            res.status(400).json({error: 'Неверное имя пользователя или пароль'});
            return;
        }
        if (!user.password) {
            res.status(400).json({
                error: "Этот аккаунт был зарегистрирован через Google. Пожалуйста, войдите с помощью Google."
            });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({error: 'Неверное имя пользователя или пароль'});
            return;
        }

        const token = jwt.sign(
            {userId: user._id, username: user.username},
            JWT_SECRET,
            {expiresIn: '10h'}
        );

        res.status(200).json({message: 'Успешная авторизация', token});
    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
            res.status(400).json({error: err.errors.map(e => e.message).join(', ')});
        } else if (err instanceof Error) {
            logError('Ошибка авторизации:', err.message);
            res.status(500).json({error: 'Ошибка сервера'});
        } else {
            logError('Неизвестная ошибка при авторизации:', err);
            res.status(500).json({error: 'Ошибка сервера'});
        }
    }
};

export const forgotpassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {email} = req.body;

    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            res.status(404).json({error: "Пользователь с таким email не найден"});
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
        await user.save();

        const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {user: EMAIL_FROM, pass: EMAIL_PASSWORD},
        });

        await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: "Восстановление пароля",
            html: `
        <h3>Сброс пароля</h3>
        <p>Чтобы сбросить пароль, перейдите по ссылке:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ссылка действует 1 час.</p>
      `,
        });

        res.json({message: "Ссылка для восстановления отправлена на email"});
    } catch (err: unknown) {
        if (err instanceof Error) {
            logError('Ошибка при отправке письма:', err.message);
        } else {
            logError('Неизвестная ошибка при отправке письма:', err);
        }
        res.status(500).json({error: "Ошибка при отправке письма"});
    }
};

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {token, password} = req.body;

    try {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: new Date()},
        });
        if (!user) {
            res.status(400).json({error: "Ссылка недействительна или истекла"});
            return;
        }

        user.password = await bcryptjs.hash(password, SALT_ROUNDS);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({message: "Пароль успешно обновлён"});
    } catch (err: unknown) {
        if (err instanceof Error) {
            logError('Ошибка при обновлении пароля:', err.message);
        } else {
            logError('Неизвестная ошибка при обновлении пароля:', err);
        }
        res.status(500).json({error: "Ошибка при обновлении пароля"});
    }
};