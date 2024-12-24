import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Нет токена" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Нет токена" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ error: "Неверный или истёкший токен" });
      return;
    }

    next();
  });
};
