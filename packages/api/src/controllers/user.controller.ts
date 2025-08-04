import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { userCreateValidation } from '../validations/user.validation';

const window = new JSDOM('').window;
const dompurify = DOMPurify(window);

export const UserController = (userService: IUserService) => {
  return {
    async createUser(req: Request, res: Response, next: NextFunction) {
      try {
        const sanitizedBody = {
          ...req.body,
          firstName: req.body.firstName
            ? dompurify.sanitize(req.body.firstName)
            : undefined,
          lastName: req.body.lastName
            ? dompurify.sanitize(req.body.lastName)
            : undefined,
        };

        const validatedData = userCreateValidation.parse(sanitizedBody);
        const result = await userService.create({
          ...validatedData,
          userId: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        });
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};
