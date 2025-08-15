import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import codeTaskRouter from './routes/codetask.route';
import userRouter from './routes/user.route';

import { errorHandlerMiddleware } from './middlewares/error_handler.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { authorizationMiddleware } from './middlewares/authorization.middleware';

const app = express();

// Security headers middleware
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ['self'],
      'img-src': ['self', 'data:'],
      'script-src': ['self'],
    },
  })
);

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
app.use('/users', authorizationMiddleware, userRouter);

app.get('/health', (req, res) => res.send({ status: 'ok' }));

app.use(errorHandlerMiddleware);

export default app;
