import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './router/authRoute.js'; // Ensure the correct path
import userRouter from './router/userRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

const allowedOrigins=['http://localhost:5173']
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter)
app.get('/', (req, res) => res.send('API is working'));

// Start server
app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
