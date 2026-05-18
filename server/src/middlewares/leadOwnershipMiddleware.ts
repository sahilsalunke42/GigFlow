import { Request, Response, NextFunction } from "express";
import Lead from "../models/leadModel";
import { IAuthResponse } from "../types/authtypes";

declare global {
    namespace Express {
        interface Request {
            user?: IAuthResponse;
        }
    }
}

export const leadOwnershipMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - No user found" });
        }

        const leadId = req.params.id;
        const lead = await Lead.findById(leadId);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        // Allow if user is admin or created the lead
        if (req.user.user.role === "admin" || lead.createdBy.toString() === req.user.user.id) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden - You can only manage leads you created" });
        }
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Authorization failed" });
    }
};
