import { NextFunction, Request, Response } from 'express';

export interface IGithubController {
  githubAuthCallback: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
