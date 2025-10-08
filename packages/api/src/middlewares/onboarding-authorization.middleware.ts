import { UnauthorizedError } from '../utils/errors.utils';
import { extractBearerToken, verifyJWT } from '../utils/jwt.utils';
import { OnboardingTokenPayload } from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';

export const onboardingAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    const payload = verifyJWT<OnboardingTokenPayload>(token);

    if (!payload || payload.type !== 'onboarding') {
      throw new UnauthorizedError('Invalid onboarding token');
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
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
