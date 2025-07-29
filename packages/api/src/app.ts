import express from 'express';
import { errorHandlerMiddleware } from './middlewares/error_handler.middleware';

const app = express();

app.use(errorHandlerMiddleware);

export default app;
