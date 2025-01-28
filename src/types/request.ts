import {JwtPayload} from "jsonwebtoken";
import {Request} from "express";

export interface AuthenticatedRequest extends Request {
    user?: MyTokenPayload;
}

export interface MyTokenPayload extends JwtPayload {
    userId: string;
    username: string;
}