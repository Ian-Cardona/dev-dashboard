// import z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { IApiKeysService } from './api-keys.service';
import { handleValidationError } from 'src/utils/validation-error.utils';
import { ApiKeyPublic, uuidSchema } from '@dev-dashboard/shared';

export const ApiKeysController = (apiKeysService: IApiKeysService) => {
  return {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const description = 'dev-dashboard';
        // const description = z
        //   .string()
        //   .min(2)
        //   .max(100)
        //   .parse(req.body.description);

        const result: ApiKeyPublic = await apiKeysService.create(
          userId,
          description
        );
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid API key data');
      }
    },

    async check(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        if (userId) {
          res.json({ message: 'API Key is valid' });
        }
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid request data');
      }
    },

    async findByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await apiKeysService.findByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },
  };
};
