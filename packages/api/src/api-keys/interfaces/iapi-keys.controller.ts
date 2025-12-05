import { NextFunction, Request, Response } from 'express';

export interface IApiKeysController {
  create: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  check: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  findByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  revoke: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
