// Auth Service
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { UserRole } from "../models/userModel";
import { registerSchema, loginSchema } from "../validators/authValidator";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "1h") as jwt.SignOptions["expiresIn"];


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
       
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email,password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        };


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ 
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
        const user = await User.findById(decoded.userId).select("_id name email role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const newToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ 
            token: newToken,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(401).json({ message: error instanceof Error ? error.message : "Token refresh failed" });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
        const user = await User.findById(decoded.userId).select("_id name email role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json({ 
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(401).json({ message: error instanceof Error ? error.message : "Failed to get current user" });
    }
};

export const getAssignableUsers = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user?.user;

        if (!currentUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (currentUser.role === "admin") {
            const salesUsers = await User.find({ role: UserRole.Sales })
                .select("_id name email role")
                .sort({ name: 1 });

            return res.json({
                data: salesUsers.map((user) => ({
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                })),
            });
        }

        const self = await User.findById(currentUser.id).select("_id name email role");

        if (!self) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            data: [
                {
                    id: self._id.toString(),
                    name: self.name,
                    email: self.email,
                    role: self.role,
                },
            ],
        });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch assignable users" });
    }
};
