import { IGithubController } from './interfaces/igithub.controller';
import { IGithubService } from './interfaces/igithub.service';
import {
  OAuthGithubCallbackResponseSchema,
  oAuthGithubCallbackResponseSchema,
  oAuthGithubCodeSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { IRegisterInitService } from 'src/auth-related/register-init/interfaces/iregister-init.service';
import { ENV } from 'src/config/env_variables';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubController = (
  githubService: IGithubService,
  registerInitService: IRegisterInitService
): IGithubController => {
  return {
    async githubAuthCallback(req: Request, res: Response, next: NextFunction) {
      try {
        const { code } = oAuthGithubCodeSchema.parse(req.query);

        const tokenData: OAuthGithubCallbackResponseSchema =
          await githubService.exchangeCodeForToken(code);

        const validatedToken =
          oAuthGithubCallbackResponseSchema.parse(tokenData);
        const githubUser = await githubService.getUserProfile(
          validatedToken.access_token
        );

        const token = await registerInitService.oauth({
          provider: 'github',
          id: githubUser.id.toString(),
          login: githubUser.login,
        });

        const redirectUrl = new URL('/register', ENV.APP_BASE_URL);
        redirectUrl.searchParams.append('provider', 'github');
        redirectUrl.searchParams.append('id', githubUser.id.toString());
        redirectUrl.searchParams.append('login', githubUser.login);
        redirectUrl.searchParams.append('token', token.registerInitToken);

        return res.redirect(redirectUrl.toString());
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
