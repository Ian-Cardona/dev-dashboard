import { IRegisterInitController } from './interfaces/iregister-init.controller';
import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  oauthRequestSchema,
  RegisterInitEmailRequest,
  registerInitEmailRequestSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';
import z from 'zod';

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60;

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
        const validSessionId = z.uuidv4().parse(sessionId);
        if (!validSessionId) {
          res.status(404).json({ message: 'Email session not found' });
          return;
        }

        const email = await registerInitService.getEmailSession(validSessionId);

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

    async email(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: RegisterInitEmailRequest =
          registerInitEmailRequestSchema.parse(req.body);
        const result = await registerInitService.email(validatedData);

        res.cookie('rit1', result.registrationToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('esi1', result.registrationId, {
          httpOnly: false,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.status(201).json();
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

        res.cookie('rit1', result.registrationToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.status(201).json();
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
