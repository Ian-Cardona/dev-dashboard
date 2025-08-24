import { NextFunction, Request, Response } from 'express';
import {
  // rawTodoBaseSchema,
  todoCreateSchema,
  todoItemSchema,
  updateTodoSchema,
} from '../../../shared/schemas/todo.schema';
import { ITodoService } from '../services/todo.service';
import z from 'zod';
import { userIdSchema } from '../../../shared/schemas/user.schema';

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
    // TODO: Fix this implementation
    async syncTodos(req: Request, res: Response, next: NextFunction) {
      try {
        console.log('Syncing todos...');
        const userId = userIdSchema.parse(req.user?.userId);
        console.log('User ID:', userId);
        const rawTodos = todoItemSchema.array().parse(req.body);
        console.log('Raw Todos:', rawTodos);
        const result = await todoService.syncTodos(userId, rawTodos);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async createTodo(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = todoCreateSchema.parse(req.body);
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
        const userId = z.uuidv4().parse(req.params.userId);
        const result = await todoService.findByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async updateTodo(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const id = z.uuidv4().parse(req.params.id);

        const updates = updateTodoSchema.parse(req.body);
        await todoService.update(id, userId, updates);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },

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
