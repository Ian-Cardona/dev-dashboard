import { NextFunction, Request, Response } from 'express';
import {
  codeTaskUpdateValidation,
  codeTaskValidation,
} from '../validations/codetask.validation';
import { CodeTaskService } from '../services/codetask.service';

export const createCodeTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = codeTaskValidation.parse(req.body);
    const result = await CodeTaskService.create(validatedData);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const findCodeTasksInfoByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const result = await CodeTaskService.findByUserId(userId);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCodeTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;
    const updates = codeTaskUpdateValidation.parse(req.body.updates);
    await CodeTaskService.update(id, userId, updates);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const deleteCodeTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;
    await CodeTaskService.delete(id, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
