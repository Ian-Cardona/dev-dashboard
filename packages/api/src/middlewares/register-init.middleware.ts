import { UnauthorizedError } from '../utils/errors.utils';
import { verifyJWT } from '../utils/jwt.utils';
import { RegisterInitTokenPayload } from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { redisDel } from 'src/utils/redis';

export const registerInitAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.rit1;
    if (!token)
      throw new UnauthorizedError('Missing registerInit token cookie');
    const payload: RegisterInitTokenPayload =
      verifyJWT<RegisterInitTokenPayload>(token);

    if (!payload || payload.type !== 'register-init') {
      throw new UnauthorizedError('Invalid token');
    }

    req.registerInit = {
      jti: payload.jti,
    };

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie('rit1');
    redisDel('rit1');
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof Error && error.name === 'NotBeforeError') {
      next(new UnauthorizedError('Token not active'));
    } else {
      next(error);
    }
  }
};
