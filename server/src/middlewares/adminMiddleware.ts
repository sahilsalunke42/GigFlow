import { Request, Response, NextFunction } from "express";
import { IAuthResponse } from "../types/authtypes";

// Declare the augmented Request type
declare global {
    namespace Express {
        interface Request {
            user?: IAuthResponse;
        }
    }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    if (req.user.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    next();
};
