import { Request, Response, NextFunction } from 'express';

export interface IRegisterInitController {
  email: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
