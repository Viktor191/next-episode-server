import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Расширение интерфейса для полезной нагрузки токена
export interface MyTokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

// Расширение интерфейса Request для хранения данных пользователя
export interface AuthenticatedRequest extends Request {
    user?: MyTokenPayload;
}

// Middleware для проверки JWT-токена
export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({error: 'Нет токена'});
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(403).json({error: 'Неверный или истёкший токен'});
            return;
        }

        if (typeof decoded === 'object' && 'userId' in decoded) {
            req.user = decoded as MyTokenPayload;

            // Проверка наличия userId
            if (!req.user.userId) {
                res.status(403).json({error: 'Токен не содержит идентификатора пользователя'});
                return;
            }

            next();
        } else {
            res.status(403).json({error: 'Неверный формат токена'});
        }
    });
};