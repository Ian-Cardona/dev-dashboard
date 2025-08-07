import express from 'express';

import codeTaskRouter from './routes/codetask.route';
import userRouter from './routes/user.route';

import { errorHandlerMiddleware } from './middlewares/error_handler.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';

const app = express();

app.use(express.json({ limit: '1mb' }));

app.use(loggerMiddleware);

app.use('/codetasks', codeTaskRouter);
app.use('/users', userRouter);

app.use(errorHandlerMiddleware);

export default app;
