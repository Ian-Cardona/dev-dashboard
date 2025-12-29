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
import { setCrossDomainCookie } from 'src/utils/api.utils';
import { encrypt } from 'src/utils/crypto.utils';
import { ConflictError, NotFoundError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 3 * 10 * 10 * 1000;
const ERROR_COOKIE_EXPIRY = 30000;

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
            setCrossDomainCookie(res, 'gh_o_e', 'invalid_state', {
              httpOnly: false,
              maxAge: ERROR_COOKIE_EXPIRY, // 30 seconds
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          }
        }

        let tokenData;
        try {
          tokenData = await githubService.exchangeCodeForToken(code);
        } catch (error) {
          console.error('Error during token exchange:', error);
          setCrossDomainCookie(res, 'gh_o_e', 'oauth_failed', {
            httpOnly: false,
            maxAge: ERROR_COOKIE_EXPIRY,
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
              setCrossDomainCookie(res, 'gh_o_e', 'not_found', {
                httpOnly: false,
                maxAge: ERROR_COOKIE_EXPIRY,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/settings`);
            }

            const existingUserProvider = await userService.findByProvider(
              'github',
              githubUser.id.toString()
            );

            if (existingUserProvider && existingUserProvider.id !== userId) {
              setCrossDomainCookie(res, 'gh_o_e', 'github_already_linked', {
                httpOnly: false,
                maxAge: ERROR_COOKIE_EXPIRY,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/settings`);
            }

            const encryptedToken = encrypt(validatedToken.access_token);
            await userService.linkProvider(existingUser, encryptedToken);

            return res.redirect(
              `${ENV.APP_BASE_URL}/settings?success=github_connected`
            );
          } catch (error) {
            console.error('Error during link flow:', error);
            setCrossDomainCookie(res, 'gh_o_e', 'link_failed', {
              httpOnly: false,
              maxAge: ERROR_COOKIE_EXPIRY,
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
            setCrossDomainCookie(res, 'reginid', token.registrationId, {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });

            res.clearCookie('regintkn');
            setCrossDomainCookie(res, 'regintkn', token.registrationToken, {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/register`);
          } catch (error) {
            if (error instanceof ConflictError) {
              setCrossDomainCookie(res, 'gh_o_e', 'conflict', {
                httpOnly: false,
                maxAge: ERROR_COOKIE_EXPIRY,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            setCrossDomainCookie(res, 'gh_o_e', 'oauth_failed', {
              httpOnly: false,
              maxAge: ERROR_COOKIE_EXPIRY,
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

            setCrossDomainCookie(res, 'gh_o_p', 'github', {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });

            setCrossDomainCookie(res, 'gh_o_i', githubUser.id.toString(), {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });

            setCrossDomainCookie(res, 'gh_o_l', githubUser.login.toString(), {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });

            setCrossDomainCookie(res, 'gh_o_enc', encryptedToken, {
              httpOnly: false,
              maxAge: REFRESH_TOKEN_EXPIRY,
            });
            return res.redirect(`${ENV.APP_BASE_URL}/login`);
          } catch (error) {
            if (error instanceof NotFoundError) {
              setCrossDomainCookie(res, 'gh_o_e', 'user_not_found', {
                httpOnly: false,
                maxAge: ERROR_COOKIE_EXPIRY,
              });
              return res.redirect(`${ENV.APP_BASE_URL}/register`);
            }

            setCrossDomainCookie(res, 'gh_o_e', 'oauth_failed', {
              httpOnly: false,
              maxAge: ERROR_COOKIE_EXPIRY,
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
