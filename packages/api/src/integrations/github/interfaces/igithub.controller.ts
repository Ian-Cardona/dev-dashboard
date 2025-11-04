import { NextFunction, Request, Response } from 'express';

export interface IGithubIntegrationController {
  getUserRepositories: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getLatestWorkflowRun: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getUserNotifications: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
