import { IGithubController } from './interfaces/igithub.controller';
import { IGithubService } from './interfaces/igithub.service';
import {
  githubCallbackRequestSchema,
  githubTokenSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { IRegisterInitService } from 'src/auth-related/register-init/interfaces/iregister-init.service';
import { ENV } from 'src/config/env';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { ConflictError, NotFoundError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';
import z from 'zod';

export const GithubController = (
  githubService: IGithubService,
  registerInitService: IRegisterInitService,
  userService: IUserService
): IGithubController => {
  const redirectToFrontend = (
    path: 'login' | 'register',
    params: Record<string, string>
  ): string => {
    const url = new URL(path, ENV.APP_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };
  return {
    async getAuthorizationCallbackUrl(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { code, state } = githubCallbackRequestSchema.parse(req.query);

        if (typeof code !== 'string') {
          throw new ConflictError('Invalid code');
        }

        let flow: 'login' | 'register' = 'login';
        if (state) {
          try {
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            flow = decoded.flow || 'login';
          } catch {
            return res.redirect(
              redirectToFrontend('login', { error: 'invalid_state' })
            );
          }
        }

        const tokenData = await githubService.exchangeCodeForToken(code);
        const validatedToken = githubTokenSchema.parse(tokenData);
        const githubUser = await githubService.getUserProfile(
          validatedToken.access_token
        );

        const githubParams = {
          provider: 'github',
          id: githubUser.id.toString(),
          login: githubUser.login,
        };

        if (flow === 'register') {
          try {
            const token = await registerInitService.github({
              provider: 'github',
              id: githubUser.id,
              login: githubUser.login,
            });

            return res.redirect(
              redirectToFrontend('register', {
                provider: 'github',
                id: githubUser.id.toString(),
                login: githubUser.login,
                token: token.registrationToken,
              })
            );
          } catch (error) {
            if (error instanceof ConflictError) {
              return res.redirect(
                redirectToFrontend('register', {
                  provider: 'github',
                  id: githubUser.id.toString(),
                  login: githubUser.login,
                  error: 'conflict',
                })
              );
            }

            return res.redirect(
              redirectToFrontend('register', { error: 'oauth_failed' })
            );
          }
        }

        if (flow === 'login') {
          try {
            await userService.findByProvider(
              'github',
              githubUser.id.toString()
            );
            return res.redirect(redirectToFrontend('login', githubParams));
          } catch (error) {
            if (error instanceof NotFoundError) {
              return res.redirect(
                redirectToFrontend('register', {
                  ...githubParams,
                  error: 'user_not_found',
                })
              );
            }

            return res.redirect(
              redirectToFrontend('login', { error: 'oauth_failed' })
            );
          }
        }
        throw new ConflictError('Invalid flow state');
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
        const flowSchema = z.enum(['login', 'register']);
        const flow = flowSchema.parse(req.query.flow);

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
