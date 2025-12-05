import { IApiKeysController } from './interfaces/iapi-keys.controller';
import { IApiKeysService } from './interfaces/iapi-keys.service';
import {
  ApiKey,
  ApiKeyPublic,
  CreateApiKey,
  createApiKeySchema,
  uuidSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const ApiKeysController = (
  apiKeysService: IApiKeysService
): IApiKeysController => {
  return {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const userId: string = uuidSchema.parse(req.user?.userId);
        const createApiKey: CreateApiKey = createApiKeySchema.parse(req.body);

        const result: ApiKeyPublic = await apiKeysService.create(
          userId,
          createApiKey.description
        );
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid API key data');
      }
    },

    async check(req: Request, res: Response, next: NextFunction) {
      try {
        const userId: string = uuidSchema.parse(req.user?.userId);
        if (userId) {
          res.json({ message: 'API Key is valid' });
        }
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid request data');
      }
    },

    async findByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId: string = uuidSchema.parse(req.user?.userId);
        const result: ApiKey[] = await apiKeysService.findByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async revoke(req: Request, res: Response, next: NextFunction) {
      try {
        const userId: string = uuidSchema.parse(req.user?.userId);
        const apiKeyId: string = uuidSchema.parse(req.params.id);

        await apiKeysService.revoke(userId, apiKeyId);
        res.json({ message: 'API Key revoked successfully' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid request data');
      }
    },
  };
};
