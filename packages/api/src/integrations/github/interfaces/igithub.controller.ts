import { NextFunction, Request, Response } from 'express';

export interface IGithubIntegrationController {
  listUserRepositories: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getLatestWorkflowRun: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
