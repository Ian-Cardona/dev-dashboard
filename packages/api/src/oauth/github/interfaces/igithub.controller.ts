import { NextFunction, Request, Response } from 'express';

export interface IGithubController {
  getAuthorizationCallbackUrl: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getAuthorizeLink: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
