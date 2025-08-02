import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { DatabaseError, NotFoundError } from '../services/codetask.service';

// TODO: Improve the error handler middleware
export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.issues,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      error: error.message,
    });
  }

  if (error instanceof DatabaseError) {
    return res.status(500).json({
      error: error.message,
    });
  }

  next(error);
};

// import { NextFunction, Request, Response } from 'express';
// import z from 'zod';
// import { DatabaseError, NotFoundError } from '../services/codetask.service';

// export const errorHandlerMiddleware = (
//   error: unknown,
//   _req: Request,
//   res: Response,
//   _next: NextFunction
// ) => {
//   if (error instanceof z.ZodError) {
//     return res.status(400).json({
//       error: 'Validation failed',
//       details: error.issues,
//     });
//   }

//   if (error instanceof NotFoundError) {
//     return res.status(404).json({
//       error: error.message,
//     });
//   }

//   if (error instanceof DatabaseError) {
//     return res.status(500).json({
//       error: error.message,
//     });
//   }

//   console.error('Unexpected error:', error);
//   return res.status(500).json({
//     error: 'Internal server error',
//   });
// };
