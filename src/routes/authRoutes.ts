import { Router, Request, Response } from "express";
import bcryptjs from "bcryptjs";

import { User } from "models/UserModel";

const router: Router = Router();

const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Введите логин и пароль" });
      return;
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res
        .status(400)
        .json({ error: "Пользователь с таким именем уже существует" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    newUser.save();

    res.status(201).json({
      message: "Пользователь зарегистрирован",
    });
  } catch (err: any) {
    console.error("Ошибка регистрации:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

export const registerRoute = router.post("/register", register);
