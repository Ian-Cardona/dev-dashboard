import { Response } from 'express';

export const sendError = (
  res: Response,
  error: string,
  message: string,
  statusCode: number = 404
) => {
  return res.status(statusCode).json({
    error,
    message,
  });
};
