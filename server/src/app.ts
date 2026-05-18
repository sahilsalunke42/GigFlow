import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import { swaggerServe, swaggerSetup } from './utils/swagger';
const app = express();

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'https://gig-flow-eight-kappa.vercel.app',
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const isAllowedOrigin =
            allowedOrigins.includes(origin) ||
            /^https:\/\/.*\.vercel\.app$/.test(origin);

        return callback(null, isAllowedOrigin);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



//Routes
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use('/api-docs', swaggerServe, swaggerSetup);




export default app;