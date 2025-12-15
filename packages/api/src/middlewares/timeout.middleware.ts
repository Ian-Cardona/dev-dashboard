import { sendError } from '../utils/api.utils';
import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/utils/logger.utils';

const DEFAULT_TIMEOUT_MS = 30000;

export const timeoutMiddleware = (timeoutMs: number = DEFAULT_TIMEOUT_MS) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let timeoutOccurred = false;

    const timer = setTimeout(() => {
      timeoutOccurred = true;

      if (!res.headersSent) {
        logger.warn('Request timeout', {
          method: req.method,
          path: req.originalUrl,
          ip: req.ip,
          timeoutMs,
        });

        sendError(
          res,
          'Request Timeout',
          'The request took too long to process',
          408
        );
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    res.on('close', () => {
      clearTimeout(timer);
    });

    Object.defineProperty(res, 'timedOut', {
      get: () => timeoutOccurred,
    });

    next();
  };
};
