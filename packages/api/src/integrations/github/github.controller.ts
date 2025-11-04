import { IGithubIntegrationController } from './interfaces/igithub.controller';
import { IGithubIntegrationService } from './interfaces/igithub.service';
import {
  githubNotificationSchema,
  githubWorkflowSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubIntegrationController = (
  githubIntegrationService: IGithubIntegrationService
): IGithubIntegrationController => {
  return {
    async getUserRepositories(
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
          await githubIntegrationService.getUserRepositories(accessToken);
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
        const access_token = req.githubUser?.access_token;
        const { owner, repo } = req.params;

        const validatedData = githubWorkflowSchema.parse({
          access_token,
          owner,
          repo,
        });

        const data =
          await githubIntegrationService.getLatestWorkflowRun(validatedData);
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

    async getUserNotifications(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const access_token = req.githubUser?.access_token;
        const { all, participating, per_page } = req.query;
        const validatedData = githubNotificationSchema.parse({
          access_token,
          all,
          participating,
          per_page,
        });

        const data =
          await githubIntegrationService.getUserNotifications(validatedData);

        res.status(200).json(data);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to fetch GitHub notifications'
        );
      }
    },
  };
};
