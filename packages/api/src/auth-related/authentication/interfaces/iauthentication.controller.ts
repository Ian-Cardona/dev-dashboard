import { NextFunction, Request, Response } from 'express';

export interface IAuthenticationController {
  completeRegisterUserByEmail: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  completeRegisterUserByOAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  loginUserByEmail: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  loginUserByOAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  refreshAccessToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  logoutUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  verifyAccessToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
