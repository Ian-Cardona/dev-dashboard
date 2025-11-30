import { accessAuthorizationMiddleware } from './access-authorization.middleware';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'src/utils/errors.utils';
import { extractBearerToken } from 'src/utils/jwt.utils';

export const conditionalAccessAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    if (token) {
      return accessAuthorizationMiddleware(req, res, next);
    }
  } catch {
    //
  }

  const flow = req.query.flow as string;
  if (flow === 'link') {
    return next(new UnauthorizedError('Authentication required for link flow'));
  }

  next();
};
