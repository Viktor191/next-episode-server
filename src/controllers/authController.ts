import {Request, Response} from "express";
import {UserModel} from "models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// Валидация входных данных с использованием Zod
const userInputSchema = z.object({
    username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа").max(30, "Имя пользователя не может превышать 30 символов"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

// Регистрация
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedInput = userInputSchema.parse(req.body);

        const {username, password} = parsedInput;

        const existingUser = await UserModel.findOne({username});
        if (existingUser) {
            res.status(400).json({error: 'Пользователь с таким именем уже существует'});
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        const newUser = new UserModel({username, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'Пользователь зарегистрирован'});
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({error: error.errors.map(e => e.message).join(', ')});
        } else {
            console.error('Ошибка регистрации:', error.message);
            res.status(500).json({error: 'Ошибка сервера'});
        }
    }
};

// Авторизация
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedInput = userInputSchema.parse(req.body);

        const {username, password} = parsedInput;

        const user = await UserModel.findOne({username});
        if (!user) {
            res.status(400).json({error: 'Неверное имя пользователя или пароль'});
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
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({error: error.errors.map(e => e.message).join(', ')});
        } else {
            console.error('Ошибка авторизации:', error.message);
            res.status(500).json({error: 'Ошибка сервера'});
        }
    }
};