// app.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import productsRouter from './routes/products';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import categoriesRouter from './routes/categories';
import consultationsRouter from './routes/consultations';
import usersRouter from './routes/users';
import analyticsRouter from './routes/analytics'; // הוספת הנתיב החדש

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/jobs', jobsRouter);
app.use('/categories', categoriesRouter);
app.use('/consultations', consultationsRouter);
app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter); // הוספת הנתיב החדש

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'Khila API' });
});

export default app;