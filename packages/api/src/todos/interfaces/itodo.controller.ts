import { NextFunction, Request, Response } from 'express';

export interface ITodoController {
  createBatch: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getBatchesByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getBatchByUserIdAndSyncId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getLatestBatchByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getRecentBatchesByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getProjectsByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getBatchesByUserIdAndProject: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getPendingResolutionsByUserId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  updateResolutionsAsResolved: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  getResolved: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
