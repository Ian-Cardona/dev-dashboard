import { IGithubService } from './interfaces/igithub.service';
import {
  oAuthGithubCallbackResponseSchema,
  OAuthGithubCallbackResponseSchema,
  oAuthGithubCodeSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubController = (githubService: IGithubService) => {
  return {
    async githubAuthCallback(req: Request, res: Response, next: NextFunction) {
      try {
        const { code } = oAuthGithubCodeSchema.parse(req.query);

        const tokenData: OAuthGithubCallbackResponseSchema =
          await githubService.exchangeCodeForToken(code);

        const validatedToken =
          oAuthGithubCallbackResponseSchema.parse(tokenData);

        return res.status(200).json(validatedToken);
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
