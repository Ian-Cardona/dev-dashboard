import { NextFunction, Request, Response } from 'express';

export interface IRegisterInitController {
  getEmailSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getOAuthSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  email: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  github: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
