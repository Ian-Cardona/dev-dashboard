import { NextFunction, Request, Response } from 'express';
import z from 'zod';

// TODO: Improve the error handler middleware
export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
