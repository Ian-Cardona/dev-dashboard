import { NextFunction, Request, Response } from 'express';
import { IRefreshTokenService } from '../services/refreshToken.service';
import z from 'zod';
import { refreshTokenCreateValidation } from '../validations/refreshToken.validation';

export const RefreshTokenController = (
  refreshTokenService: IRefreshTokenService
) => {
  const handleValidationError = (
    error: unknown,
    res: Response,
    next: NextFunction,
    message: string
  ) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: message,
        details: error.issues,
      });
    }
    next(error);
  };

  return {
    async createRefreshToken(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = refreshTokenCreateValidation.parse(req.body);
        const result = await refreshTokenService.create(validatedData);
        return res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid refresh token data');
      }
    },

    async findRefreshTokenByUserAndToken(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const tokenId = z.uuidv4().parse(req.params.tokenId);
        const result = await refreshTokenService.findByUserAndToken(
          userId,
          tokenId
        );

        if (!result) {
          return res.status(404).json({ error: 'Refresh token not found' });
        }

        return res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid user ID or token ID format'
        );
      }
    },

    async deleteRefreshTokenByUserAndToken(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const tokenId = z.uuidv4().parse(req.params.tokenId);
        await refreshTokenService.deleteToken(userId, tokenId);
        return res.status(204).end();
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid user ID or token ID format'
        );
      }
    },

    async deleteAllUserTokensByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        await refreshTokenService.deleteAllUserTokens(userId);
        return res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async deleteExpiredTokens(req: Request, res: Response, next: NextFunction) {
      try {
        await refreshTokenService.deleteExpiredTokens();
        return res.status(204).end();
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to delete expired tokens'
        );
      }
    },
  };
};
