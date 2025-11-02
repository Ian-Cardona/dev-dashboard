import { docClient } from '../../config/dynamodb';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { UnauthorizedError } from '../../utils/errors.utils';
import { extractBearerToken, verifyJWT } from '../../utils/jwt.utils';
import { AccessTokenPayload } from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';

const userService = UserService(UserRepository(docClient));

export const accessAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    const payload: AccessTokenPayload = verifyJWT<AccessTokenPayload>(token);

    const user = await userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User account no longer exists');
    }
    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }
    if (!user.email) {
      throw new UnauthorizedError('User email is missing');
    }

    req.user = {
      userId: user.id,
      email: user.email,
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
