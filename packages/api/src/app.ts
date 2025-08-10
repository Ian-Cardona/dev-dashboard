import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import codeTaskRouter from './routes/codetask.route';
import userRouter from './routes/user.route';
import refreshTokenRouter from './routes/refreshToken.route';

import { errorHandlerMiddleware } from './middlewares/error_handler.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';

const app = express();

// Security headers middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));

app.use(loggerMiddleware);

app.use('/codetasks', codeTaskRouter);
app.use('/users', userRouter);
app.use('/refreshToken', refreshTokenRouter);

app.use(errorHandlerMiddleware);

export default app;
