import { ApiKeysService } from '../api-keys/api-keys.service';
import { docClient } from '../config/dynamodb';
import { NextFunction, Request, Response } from 'express';
import { ApiKeysRepository } from 'src/api-keys/api-keys.repository';
import { extractBearerToken } from 'src/utils/jwt.utils';

const apiKeysService = ApiKeysService(ApiKeysRepository(docClient));

export const apiKeysMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    const apiKey = await apiKeysService.validate(token);

    req.user = {
      userId: apiKey.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
