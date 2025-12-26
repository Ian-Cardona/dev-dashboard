import { IRegisterInitController } from './interfaces/iregister-init.controller';
import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  oauthRequestSchema,
  RegisterInitEmailRequest,
  registerInitEmailRequestSchema,
  uuidSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { setCrossDomainCookie } from 'src/utils/api.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const RegisterInitController = (
  registerInitService: IRegisterInitService
): IRegisterInitController => {
  return {
    async getEmailSession(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const sessionId = req.query.session;
        const validSessionId = uuidSchema.parse(sessionId);
        if (!validSessionId) {
          res.status(404).json({ message: 'Email session not found' });
          return;
        }

        const email: string | null =
          await registerInitService.getEmailSession(validSessionId);

        if (!email) {
          res.status(404).json({ message: 'Email session expired or invalid' });
          return;
        }

        res.status(200).json({ email });
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to retrieve email session'
        );
      }
    },

    async getOAuthSession(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const sessionId = req.query.session;
        const validSessionId = uuidSchema.parse(sessionId);
        console.log('Valid session ID:', validSessionId);
        if (!validSessionId) {
          res.status(404).json({ message: 'OAuth session not found' });
          return;
        }

        const oauth: number | null =
          await registerInitService.getOAuthSession(validSessionId);

        if (!oauth) {
          res.status(404).json({ message: 'OAuth session expired or invalid' });
          return;
        }

        res.status(200).json({ oauth });
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Failed to retrieve OAuth session'
        );
      }
    },

    async email(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: RegisterInitEmailRequest =
          registerInitEmailRequestSchema.parse(req.body);
        const result = await registerInitService.email(validatedData);

        setCrossDomainCookie(res, 'regintkn', result.registrationToken, {
          httpOnly: true,
        });
        setCrossDomainCookie(res, 'esi1', result.registrationId, {
          httpOnly: false,
        });

        res.status(201).json({
          registrationId: result.registrationId,
        });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async github(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData = oauthRequestSchema.parse(req.body);
        const result = await registerInitService.github(validatedData);

        setCrossDomainCookie(res, 'regintkn', result.registrationToken, {
          httpOnly: true,
        });
        setCrossDomainCookie(res, 'reginid', result.registrationId, {
          httpOnly: true,
        });

        res.status(201).json({
          registrationId: result.registrationId,
        });
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid OAuth registration data'
        );
      }
    },
  };
};
