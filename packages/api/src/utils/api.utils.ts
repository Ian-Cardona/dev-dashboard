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
  const isProduction = ENV.NODE_ENV === 'production';

  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? false,
    secure: true,
    sameSite: isProduction ? 'lax' : 'none',
    path: '/',
    domain: isProduction ? '.devdashboard.app' : 'localhost',
    maxAge: options.maxAge ?? REFRESH_TOKEN_EXPIRY,
    partitioned: false,
  });
};
