import { IGithubController } from './interfaces/igithub.controller';
import { IGithubService } from './interfaces/igithub.service';
import {
  AuthFlowQueryParam,
  authFlowQueryParamSchema,
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

        let flow: AuthFlowQueryParam = 'login';

        if (state) {
          try {
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            flow = decoded.flow || 'login';
          } catch {
            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'invalid_state', {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
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
            secure: true,
            httpOnly: false,
            sameSite: 'none',
            maxAge: 300000,
          });
          return res.redirect(`${ENV.APP_BASE_URL}/login`);
        }

        const validatedToken = githubTokenSchema.parse(tokenData);
        const githubUser = await githubService.getUserProfile(
          validatedToken.access_token
        );

        if (flow === 'link') {
          try {
            const userId = req.user?.userId;
            const email = req.user?.email;
            if (!userId || !email) {
              throw new Error('Missing user authentication');
            }

            const existingUser = await userService.findByEmailPrivate(email);

            if (existingUser && existingUser.id !== userId) {
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'not_found', {
                secure: true,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/settings`);
            }

            const existingUserProvider = await userService.findByProvider(
              'github',
              githubUser.id.toString()
            );

            if (existingUserProvider && existingUserProvider.id !== userId) {
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'github_already_linked', {
                secure: true,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/settings`);
            }

            const encryptedToken = encrypt(validatedToken.access_token);
            await userService.linkProvider(existingUser, encryptedToken);

            res.clearCookie('gh_o_e');
            res.cookie('gh_o_s', 'github_connected', {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });

            return res.redirect(`${ENV.APP_BASE_URL}/settings`);
          } catch (error) {
            console.error('Error during link flow:', error);
            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'link_failed', {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/settings`);
          }
        }

        if (flow === 'register') {
          try {
            const token = await registerInitService.github({
              provider: 'github',
              id: githubUser.id,
              login: githubUser.login,
              access_token: validatedToken.access_token,
            });

            res.clearCookie('reginid');
            res.cookie('reginid', token.registrationId, {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });

            res.clearCookie('regintkn');
            res.cookie('regintkn', token.registrationToken, {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });

            return res.redirect(`${ENV.APP_BASE_URL}/register`);
          } catch (error) {
            if (error instanceof ConflictError) {
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'conflict', {
                secure: true,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'oauth_failed', {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
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
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            res.cookie('gh_o_i', githubUser.id.toString(), {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            res.cookie('gh_o_l', githubUser.login, {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            res.cookie('gh_o_enc', encryptedToken, {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          } catch (error) {
            if (error instanceof NotFoundError) {
              console.log('Error during login flow:', error);
              res.clearCookie('gh_o_e');
              res.cookie('gh_o_e', 'user_not_found', {
                secure: true,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 300000,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            res.clearCookie('gh_o_e');
            res.cookie('gh_o_e', 'oauth_failed', {
              secure: true,
              httpOnly: false,
              sameSite: 'none',
              maxAge: 300000,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          }
        }

        throw new Error('Invalid OAuth flow');
      } catch (error) {
        console.error('Error in GitHub OAuth callback:', error);
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
        const flow = authFlowQueryParamSchema.parse(req.query.flow);

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
