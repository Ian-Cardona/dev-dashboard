import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors.utils';
import { extractBearerToken, verifyJWT } from '../utils/jwt.utils';
import { AuthorizationTokenPayload } from '../../../shared/src/types/auth.type';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { docClient } from '../config/dynamodb';

const userService = UserService(UserModel(docClient));

// TODO: Create test suite for this
export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    console.log('Bearer:', token);
    const payload: AuthorizationTokenPayload = verifyJWT(token);
    console.log('Payload:', payload);

    const user = await userService.findById(payload.userId);
    console.log('User ID:', user);
    if (!user) {
      throw new UnauthorizedError('User account no longer exists');
    }
    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    req.user = {
      userId: user.userId,
      email: user.email,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
