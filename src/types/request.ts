import {Request} from "express";
import {JwtPayload} from "jsonwebtoken";

export interface MyTokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

export interface AuthenticatedRequest<
    P = Record<string, any>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: MyTokenPayload;
}
