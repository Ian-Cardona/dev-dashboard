import { NextFunction, Request, Response } from 'express';
import {
  codeTaskCreateValidation,
  codeTaskUpdateValidation,
} from '../validations/codetask.validation';
import { ICodeTaskService } from '../services/codetask.service';
import z from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const dompurify = DOMPurify(window);

export const CodeTaskController = (codeTaskService: ICodeTaskService) => {
  return {
    async createCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const sanitizedBody = {
          ...req.body,
          content: req.body.content
            ? dompurify.sanitize(req.body.content)
            : undefined,
        };

        const validatedData = codeTaskCreateValidation.parse(sanitizedBody);
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
        const userId = z.string().pipe(z.uuid()).parse(req.params.userId);
        const result = await codeTaskService.findByUserId(userId);

        // Sanitize the response content
        const sanitizedData = {
          ...result,
          data: result.data.map(task => ({
            ...task,
            content: task.content
              ? dompurify.sanitize(task.content)
              : undefined,
          })),
        };

        res.json(sanitizedData);
      } catch (error) {
        next(error);
      }
    },

    async updateCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.string().pipe(z.uuid()).parse(req.params.userId);
        const id = z.string().pipe(z.uuid()).parse(req.params.id);

        const sanitizedBody = {
          ...req.body,
          content: req.body.content
            ? dompurify.sanitize(req.body.content)
            : undefined,
        };

        const updates = codeTaskUpdateValidation.parse(sanitizedBody);
        await codeTaskService.update(id, userId, updates);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },

    async deleteCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        // TODO: Refactor this to use zod validation
        const userId = z.string().pipe(z.uuid()).parse(req.params.userId);
        const id = z.string().pipe(z.uuid()).parse(req.params.id);

        await codeTaskService.delete(id, userId);

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
};
