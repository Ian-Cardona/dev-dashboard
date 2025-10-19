import { IGithubController } from './interfaces/igithub.controller';
import { IGithubService } from './interfaces/igithub.service';
import {
  githubCallbackRequestSchema,
  githubTokenSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { IRegisterInitService } from 'src/auth-related/register-init/interfaces/iregister-init.service';
import { ENV } from 'src/config/env_variables';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { ConflictError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const GithubController = (
  githubService: IGithubService,
  registerInitService: IRegisterInitService,
  userService: IUserService
): IGithubController => {
  return {
    async getAuthorizationCallbackUrl(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { code } = githubCallbackRequestSchema.parse(req.query);

        if (typeof code !== 'string') {
          throw new ConflictError('Invalid code');
        }

        const flowParam = req.query.flow;
        let flow: 'login' | 'register';

        if (flowParam === 'login') {
          flow = 'login';
        } else if (flowParam === 'register') {
          flow = 'register';
        } else {
          throw new ConflictError('Invalid flow');
        }

        const tokenData = await githubService.exchangeCodeForToken(code);

        const validatedToken = githubTokenSchema.parse(tokenData);

        const githubUser = await githubService.getUserProfile(
          validatedToken.access_token
        );

        if (flow === 'register') {
          const token = await registerInitService.oauth({
            provider: 'github',
            id: githubUser.id,
            login: githubUser.login,
          });

          const redirectUrl = new URL('/register', ENV.APP_BASE_URL);
          redirectUrl.searchParams.append('provider', 'github');
          redirectUrl.searchParams.append('id', githubUser.id.toString());
          redirectUrl.searchParams.append('login', githubUser.login);
          redirectUrl.searchParams.append('token', token.registerInitToken);

          return res.redirect(redirectUrl.toString());
        }

        if (flow === 'login') {
          const user = await userService.findByProvider(
            'github',
            githubUser.id
          );

          if (user) {
            const redirectUrl = new URL('/login', ENV.APP_BASE_URL);
            redirectUrl.searchParams.append('provider', 'github');
            redirectUrl.searchParams.append('id', githubUser.id.toString());
            redirectUrl.searchParams.append('login', githubUser.login);
            return res.redirect(redirectUrl.toString());
          }

          const redirectUrl = new URL('/register', ENV.APP_BASE_URL);
          redirectUrl.searchParams.append('provider', 'github');
          redirectUrl.searchParams.append('id', githubUser.id.toString());
          redirectUrl.searchParams.append('login', githubUser.login);
          redirectUrl.searchParams.append('error', 'user_not_found');
          return res.redirect(redirectUrl.toString());
        }
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to handle GitHub OAuth callback'
        );
      }
    },

    async getAuthorizeLink(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const flowParam = req.query.flow;
        let flow: 'login' | 'register';

        if (flowParam === 'login') {
          flow = 'login';
        } else if (flowParam === 'register') {
          flow = 'register';
        } else {
          throw new ConflictError('Invalid flow');
        }

        const result = await githubService.getAuthorizeLink(flow);
        res.status(200).json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to retrieve GitHub link'
        );
      }
    },
  };
};
