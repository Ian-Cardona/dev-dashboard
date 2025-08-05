import { Request, Response, NextFunction } from 'express';
import { DatabaseError, NotFoundError } from '../utils/errors.utils';
import { sendError } from '../utils/api.utils';

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }

  const isLargePayloadError =
    error instanceof Error &&
    error.message.includes('request entity too large');
  const isSyntaxError = error instanceof SyntaxError && 'body' in error;

  if (isLargePayloadError) {
    return sendError(
      res,
      'Payload Too Large',
      'Request body exceeds size limit',
      413
    );
  }

  if (isSyntaxError) {
    return sendError(
      res,
      'Invalid JSON',
      'Request body contains malformed JSON',
      400
    );
  }

  if (error instanceof NotFoundError) {
    return sendError(res, 'Not Found', error.message, 404);
  }

  if (error instanceof DatabaseError) {
    return sendError(res, 'Database Error', error.message, 500);
  }

  if (process.env.NODE_ENV === 'production') {
    return sendError(
      res,
      'Internal Server Error',
      'An unexpected error occurred',
      500
    );
  }

  return sendError(
    res,
    'Internal Server Error',
    'An unexpected error occurred',
    500
  );
};
