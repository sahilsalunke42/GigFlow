// Auth Service
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
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
        res.json({ token });

    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
}