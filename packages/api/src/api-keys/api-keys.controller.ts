// import z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { IApiKeysService } from './api-keys.service';
import { handleValidationError } from 'src/utils/validation-error.utils';
import { uuidSchema } from '@dev-dashboard/shared';

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

        const result = await apiKeysService.create(userId, description);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid API key data');
      }
    },

    async checkConnection(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        if (userId) {
          res.json({ message: 'API Key is valid' });
        }
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid request data');
      }
    },
  };
};
