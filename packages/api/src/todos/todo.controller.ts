import z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ITodoService } from './todo.service';
import {
  rawTodoBaseSchema,
  createTodoSchema,
  uuidSchema,
} from '@dev-dashboard/shared';

export const TodoController = (todoService: ITodoService) => {
  const handleValidationError = (
    error: unknown,
    res: Response,
    next: NextFunction,
    message: string
  ) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: message,
        details: error.issues,
      });
    }
    next(error);
  };

  return {
    async syncTodos(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const rawTodos = z.array(rawTodoBaseSchema).parse(req.body.todos);

        const result = await todoService.sync(userId, rawTodos);
        res.json(result);
      } catch (error) {
        console.log('Error syncing todos:', error);
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async createTodo(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = createTodoSchema.parse(req.body);
        const result = await todoService.create(validatedData);
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },

    async findTodosInfoByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async findByUserIdAndSyncId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const syncId = uuidSchema.parse(req.params.syncId);

        const result = await todoService.findByUserIdAndSyncId(userId, syncId);
        console.log('Result:', result);

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid user ID or sync ID format'
        );
      }
    },

    async findLatestByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findLatestByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async findRecentByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findRecentByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async findProjectsByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findProjectsByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async findByUserIdAndProjectName(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const projectName = z.string().min(1).parse(req.params.projectName);

        const result = await todoService.findByUserIdAndProject(
          userId,
          projectName
        );

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid user ID or project name format'
        );
      }
    },

    // async updateTodo(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const userId = z.uuidv4().parse(req.params.userId);
    //     const id = z.uuidv4().parse(req.params.id);

    //     const updates = updateTodoSchema.parse(req.body);
    //     await todoService.update(id, userId, updates);
    //     res.status(204).end();
    //   } catch (error) {
    //     handleValidationError(error, res, next, 'Invalid code task data');
    //   }
    // },

    async deleteTodo(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const id = z.uuidv4().parse(req.params.id);

        await todoService.delete(id, userId);

        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },
  };
};
