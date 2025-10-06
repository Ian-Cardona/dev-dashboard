import { IGithubService } from './interfaces/igithub.service';
import { githubCodeSchema } from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubController = (githubService: IGithubService) => {
  return {
    async githubAuthCallback(req: Request, res: Response, next: NextFunction) {
      try {
        const { code } = githubCodeSchema.parse(req.query);

        const tokenData = await githubService.exchangeCodeForToken(code);

        return res.status(200).json(tokenData);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to exchange GitHub code'
        );
      }
    },
  };
};
