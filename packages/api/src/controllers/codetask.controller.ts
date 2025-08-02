import { NextFunction, Request, Response } from 'express';
import {
  codeTaskUpdateValidation,
  codeTaskValidation,
} from '../validations/codetask.validation';
import { ICodeTaskService } from '../services/codetask.service';

export const CodeTaskController = (codeTaskService: ICodeTaskService) => {
  return {
    async createCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = codeTaskValidation.parse(req.body);

        const result = await codeTaskService.create(validatedData);

        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    async findCodeTasksInfoByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { userId } = req.params;

        const result = await codeTaskService.findByUserId(userId);

        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    async updateCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const { id, userId } = req.params;
        const updates = codeTaskUpdateValidation.parse(req.body);

        await codeTaskService.update(id, userId, updates);

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },

    async deleteCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const { id, userId } = req.params;

        await codeTaskService.delete(id, userId);

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
};
