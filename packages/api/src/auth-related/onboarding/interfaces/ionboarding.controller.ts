import { Request, Response, NextFunction } from 'express';

export interface IOnboardingController {
  initiateEmailOnboarding: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
