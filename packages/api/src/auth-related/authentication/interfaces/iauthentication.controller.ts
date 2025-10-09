import { Request, Response, NextFunction } from 'express';

export interface IAuthenticationController {
  registerUserByEmail: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  registerUserByOAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  loginUser: (
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
