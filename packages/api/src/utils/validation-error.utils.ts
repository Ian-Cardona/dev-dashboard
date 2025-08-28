import { NextFunction, Response } from 'express';
import z from 'zod';

export const handleValidationError = (
  error: unknown,
  res: Response,
  next: NextFunction,
  message: string
) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: message,
      details: error.issues,
    });
  }
  next(error);
};
