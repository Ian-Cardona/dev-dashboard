import { ITodoService } from './interfaces/itodo.service';
import {
  createResolutionSchema,
  rawTodoBatchSchema,
  uuidSchema,
  VALIDATION_CONSTANTS,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';
import z from 'zod';

export const TodoController = (todoService: ITodoService) => {
  return {
    async createBatch(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const rawBatch = rawTodoBatchSchema.parse(req.body);

        const result = await todoService.createBatch(userId, rawBatch);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid input format');
      }
    },

    async getBatchesByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getBatchesByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async getBatchByUserIdAndSyncId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const syncId = uuidSchema.parse(req.params.syncId);

        const result = await todoService.getBatchByUserIdAndSyncId(
          userId,
          syncId
        );

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid User ID or Sync ID format'
        );
      }
    },

    async getLatestBatchByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getLatestBatchByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async getRecentBatchesByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getRecentBatchesByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async getProjectsByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getProjectsByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async getBatchesByUserIdAndProject(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const projectName = z
          .string()
          .min(1)
          .max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH)
          .parse(req.params.projectName);

        const result = await todoService.getBatchesByUserIdAndProject(
          userId,
          projectName
        );

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid User ID format or project name format'
        );
      }
    },

    async getPendingResolutionsByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getPendingResolutionsByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async updateResolutionsAsResolved(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const resolutions = z.array(createResolutionSchema).parse(req.body);

        const result = await todoService.updateResolutionsAsResolved(
          userId,
          resolutions
        );
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid resolution format');
      }
    },

    async getResolved(req: Request, res: Response, next: NextFunction) {
      try {
        console.log('Getting resolved todos');
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.getResolved(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },
  };
};
