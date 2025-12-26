import { Response } from 'express';
import { ENV } from 'src/config/env';

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60;

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

export const setCrossDomainCookie = (
  res: Response,
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    maxAge?: number;
  } = {}
) => {
  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? false,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: ENV.NODE_ENV === 'production' ? '.devdashboard.app' : 'localhost',
    maxAge: options.maxAge ?? REFRESH_TOKEN_EXPIRY,
    partitioned: false,
  });
};
