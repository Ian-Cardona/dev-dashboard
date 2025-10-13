import { Request, Response, NextFunction } from 'express';

export interface IRegisterInitController {
  getEmailSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  email: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
