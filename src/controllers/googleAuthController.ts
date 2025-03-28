import {Request, Response} from "express";
import {OAuth2Client} from "google-auth-library";
import {UserModel} from "models/userModel";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const {credential} = req.body;

        if (!credential) {
            res.status(400).json({error: "Токен не предоставлен"});
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;

        if (!email) {
            res.status(400).json({error: "Не удалось получить email из токена"});
            return;
        }

        let user = await UserModel.findOne({username: email});

        if (!user) {
            user = await UserModel.create({
                username: email,
                password: "", // пароля нет — логин через Google
            });
        }

        // Генерируем JWT токен или сессию
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.status(200).json({token});
    } catch (err) {
        console.error("Ошибка при входе через Google:", err);
        res.status(500).json({error: "Ошибка сервера"});
    }
};