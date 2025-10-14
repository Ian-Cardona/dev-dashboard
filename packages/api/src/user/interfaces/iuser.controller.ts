import { NextFunction, Request, Response } from 'express';

export interface IUserController {
  getUserProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  updateUserAccount: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  updateUserPassword: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  deactivateUserAccount: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
