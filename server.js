import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();

// routers
import pizzaRouter from './routes/pizzaRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import checkoutRouter from './routes/checkoutRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';

import connectDB from './db/connectDB.js';

// middleware imports
import errorHandlerMiddleware from './middleware/errorhandlerMiddleware.js';
import adminMiddleware from './middleware/adminMiddleware.js';
import { authMiddleware } from './middleware/authmiddleware.js';

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.get('/', (req, res) => {
  res.send('Hello World');
});

// middlewares
app.use('/api/v1', webhookRouter);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes>>>>>>>>>>>>
app.use('/api/v1/pizzas', pizzaRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', authMiddleware, adminRouter);
app.use('/api/v1', checkoutRouter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Page not found',
  });
});
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
