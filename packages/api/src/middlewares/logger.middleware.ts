import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

// TODO: Improve the logger middleware
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.path}`);
  next();
};
