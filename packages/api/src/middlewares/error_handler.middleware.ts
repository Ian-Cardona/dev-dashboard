import { sendError } from '../utils/api.utils';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  DatabaseTimeoutError,
} from '../utils/errors.utils';
import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/utils/logger.utils';

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error) {
    logger.error(error.message, {
      stack: error.stack,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
    });
  } else {
    logger.error('Unknown error type caught in errorHandlerMiddleware', {
      error,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
    });
  }

  if (res.headersSent) {
    return next(error);
  }

  const isLargePayloadError =
    error instanceof Error &&
    error.message.includes('request entity too large');
  const isSyntaxError = error instanceof SyntaxError && 'body' in error;

  const isAwsTimeoutError =
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'RequestAbortedError');

  if (isAwsTimeoutError) {
    return sendError(res, 'Request Timeout', 'Database request timed out', 408);
  }

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

  if (error instanceof DatabaseTimeoutError) {
    return sendError(res, 'Request Timeout', error.message, 408);
  }

  if (error instanceof UnauthorizedError) {
    return sendError(res, 'Unauthorized', error.message, 401);
  }

  if (error instanceof NotFoundError) {
    return sendError(res, 'Not Found', error.message, 404);
  }

  if (error instanceof ConflictError) {
    return sendError(res, 'Conflict', error.message, 409);
  }

  return sendError(res, 'Internal Server Error', 'Something went wrong', 500);
};
