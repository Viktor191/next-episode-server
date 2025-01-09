import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface MyTokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

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
        res.status(401).json({ error: 'Нет токена' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(403).json({ error: 'Неверный или истёкший токен' });
            return;
        }

        if (typeof decoded === 'object') {
            req.user = decoded as MyTokenPayload;
            next();
        } else {
            res.status(403).json({ error: 'Неверный формат токена' });
        }
    });
};