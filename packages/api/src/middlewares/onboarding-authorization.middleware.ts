import { UnauthorizedError } from '../utils/errors.utils';
import { verifyJWT } from '../utils/jwt.utils';
import { OnboardingTokenPayload } from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';

export const onboardingAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = extractBearerToken(req);
    const token = req.cookies.obt1;
    if (!token) throw new UnauthorizedError('Missing onboarding token cookie');
    const payload: OnboardingTokenPayload =
      verifyJWT<OnboardingTokenPayload>(token);

    if (!payload || payload.type !== 'onboarding') {
      throw new UnauthorizedError('Invalid onboarding token');
    }

    req.onboarding = {
      jti: payload.jti,
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
