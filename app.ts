import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import categoriesRouter from './routes/categories';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import consultationRoutes from './routes/consultations';
import userRoutes from './routes/users';
import JobsRoutes from './routes/jobs';


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/consultations', consultationRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoriesRouter);
app.use('/jobs', JobsRoutes);



// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('🚨 Unhandled Error:', err);
  res.status(500).json({ message: 'Unhandled server error' });
});

export default app;
