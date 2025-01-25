import {MyTokenPayload} from "path-to-authenticateToken";

declare global {
    namespace Express {
        interface Request {
            user?: MyTokenPayload;
        }
    }
}