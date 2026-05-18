import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { IAuthResponse } from "../types/authtypes";
import { Request, Response, NextFunction } from "express";

// Augment Express Request to include `user`
declare global {
    namespace Express {
        interface Request {
            user?: IAuthResponse;
        }
    }
}


const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select("_id name email role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role as "admin" | "sales",
            },
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}