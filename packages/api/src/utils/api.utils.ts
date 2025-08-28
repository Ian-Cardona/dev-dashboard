import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode: number = 200
) => {
  return res.status(statusCode).json(data);
};

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
