 
import 'dotenv/config';

import apiKeysRouter from './api-keys/api-keys.route';
import authenticationRouter from './auth-related/authentication/authentication.route';
import registerInitRouter from './auth-related/register-init/register-init.route';
import { accessAuthorizationMiddleware } from './middlewares/access-authorization.middleware';
import { errorHandlerMiddleware } from './middlewares/error_handler.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import githubRouter from './oauth/github/github.route';
import todoRouter from './todos/todo.route';
import userRouter from './user/user.route';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:'],
      'script-src': ["'self'"],
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(loggerMiddleware);

const v1Router = express.Router();
v1Router.use('/auth', authenticationRouter);
v1Router.use('/todos', todoRouter);
v1Router.use('/user', accessAuthorizationMiddleware, userRouter);
v1Router.use('/api-keys', apiKeysRouter);
v1Router.use('/github', githubRouter);
v1Router.use('/init', registerInitRouter);

app.use('/v1', v1Router);

app.get('/health', (req, res) => res.send({ status: 'ok' }));

app.use((req, res) => {
  res
    .status(404)
    .json({ status: 'Not Found', message: 'Path does not exist.' });
});

app.use(errorHandlerMiddleware);

export default app;
