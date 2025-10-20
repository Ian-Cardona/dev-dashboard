import { NextFunction, Response } from 'express';
import { ENV } from 'src/config/env';
import z from 'zod';

export const handleValidationError = (
  error: unknown,
  res: Response,
  next: NextFunction,
  message: string
) => {
  if (error instanceof z.ZodError) {
    const isProduction = ENV.NODE_ENV === 'production';

    const errorDetails = isProduction
      ? error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      : error.issues;

    return res.status(400).json({
      error: message,
      details: errorDetails,
    });
  }
  next(error);
};
