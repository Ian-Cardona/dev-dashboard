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
import { encrypt } from 'src/utils/crypto.utils';
import { ConflictError, NotFoundError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';
import z from 'zod';

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
            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'invalid_state', {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          }
        }

        let tokenData;
        try {
          tokenData = await githubService.exchangeCodeForToken(code);
        } catch (error) {
          console.error('Error during token exchange:', error);
          res.clearCookie('gh_o_e');
          res.cookie('gh_o_e', 'oauth_failed', {
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 300000,
          });
          return res.redirect(`${ENV.APP_BASE_URL}/login`);
        }

        const validatedToken = githubTokenSchema.parse(tokenData);
        const githubUser = await githubService.getUserProfile(
          validatedToken.access_token
        );

        if (flow === 'register') {
          try {
            const token = await registerInitService.github({
              provider: 'github',
              id: githubUser.id,
              login: githubUser.login,
              access_token: validatedToken.access_token,
            });

            res.clearCookie('gh_o_rt');
            res.cookie('gh_o_rt', token.registrationToken, {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });

            return res.redirect(`${ENV.APP_BASE_URL}/register`);
          } catch (error) {
            if (error instanceof ConflictError) {
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'conflict', {
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'oauth_failed', {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/register`);
          }
        }

        if (flow === 'login') {
          try {
            await userService.findByProvider(
              'github',
              githubUser.id.toString()
            );

            const encryptedToken = encrypt(validatedToken.access_token);

            res.clearCookie('gh_o_p');
            res.clearCookie('gh_o_i');
            res.clearCookie('gh_o_l');
            res.clearCookie('gh_o_enc');

            res.cookie('gh_o_p', 'github', {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            res.cookie('gh_o_i', githubUser.id.toString(), {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            res.cookie('gh_o_l', githubUser.login, {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            res.cookie('gh_o_enc', encryptedToken, {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          } catch (error) {
            if (error instanceof NotFoundError) {
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'user_not_found', {
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'oauth_failed', {
              httpOnly: false,
              sameSite: 'lax',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          }
        }
        throw new Error('Invalid OAuth flow');
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
