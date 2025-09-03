import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors.utils';
import { extractBearerToken, verifyJWT } from '../utils/jwt.utils';
import { AuthorizationTokenPayload } from '@dev-dashboard/shared';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';
import { docClient } from '../config/dynamodb';

const userService = UserService(UserModel(docClient));

export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    const payload: AuthorizationTokenPayload = verifyJWT(token);

    const user = await userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User account no longer exists');
    }
    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
