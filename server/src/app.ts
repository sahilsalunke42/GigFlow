import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



//Routes
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);




export default app;