import {Request, Response} from "express";
import {User} from "models/models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register =  async (req: Request<{}, {}, { username: string; password: string }>, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Введите логин и пароль' });
            return;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (error: any) {
        console.error('Ошибка регистрации:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

export const login = async (req: Request<{}, {}, { username: string; password: string }>, res: Response) : Promise<void> => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        res.status(200).json({ message: 'Успешная авторизация', token });
    } catch (error: any) {
        console.error('Ошибка авторизации:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}