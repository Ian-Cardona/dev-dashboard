import { Request, Response } from 'express';
import { codeTaskZodValidation } from '../validations/codetask.validation';
import { CodeTaskModel } from '../models/codetask.model';

export const createCodeTask = async (req: Request, res: Response) => {
  const validatedData = codeTaskZodValidation.parse(req.body);
  const result = await CodeTaskModel.create(validatedData);
  res.json(result);
};
