import { IGithubIntegrationController } from './interfaces/igithub.controller';
import { IGithubIntegrationService } from './interfaces/igithub.service';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubIntegrationController = (
  githubIntegrationService: IGithubIntegrationService
): IGithubIntegrationController => {
  return {
    async listUserRepositories(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const accessToken = req.githubUser?.access_token;

        if (typeof accessToken !== 'string' || !accessToken) {
          throw new UnauthorizedError('GitHub access token missing');
        }

        const data =
          await githubIntegrationService.listUserRepositories(accessToken);
        res.status(200).json(data);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to fetch user repositories'
        );
      }
    },

    async getLatestWorkflowRun(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const accessToken = req.githubUser?.access_token;
        const { owner, repo } = req.params;

        if (typeof accessToken !== 'string' || !accessToken) {
          throw new UnauthorizedError('GitHub access token missing');
        }

        if (!owner?.trim() || !repo?.trim()) {
          throw new Error('Owner and repository name are required');
        }

        const data = await githubIntegrationService.getLatestWorkflowRun(
          accessToken,
          owner,
          repo
        );
        res.status(200).json(data);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to fetch latest workflow run'
        );
      }
    },
  };
};
