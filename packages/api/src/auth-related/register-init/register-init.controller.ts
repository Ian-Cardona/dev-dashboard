import { IRegisterInitController } from './interfaces/iregister-init.controller';
import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  registerInitEmailRegisterRequestSchema,
  RegisterInitEmailRegisterRequest,
} from '@dev-dashboard/shared';
import { Request, Response, NextFunction } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60;

export const RegisterInitController = (
  registerInitService: IRegisterInitService
): IRegisterInitController => {
  return {
    async email(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: RegisterInitEmailRegisterRequest =
          registerInitEmailRegisterRequestSchema.parse(req.body);
        const result = await registerInitService.email(validatedData);

        // TODO: Make variables dynamic later on
        res.cookie('rit1', result.registerInitToken, {
          httpOnly: true,
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
  };
};
