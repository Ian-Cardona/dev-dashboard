import { docClient } from '../../config/dynamodb';
import { UserService } from '../../user/user.service';
import { RefreshTokenModel } from '../refresh-token/refresh-token.model';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import { Router } from 'express';
import { registerInitSessionMiddleware } from 'src/middlewares/register-init-session.middleware';
import { registerInitAuthorizationMiddleware } from 'src/middlewares/register-init.middleware';
import { UserRepository } from 'src/user/user.repository';

const router = Router();

const refreshTokenRepository = RefreshTokenModel(docClient);
const userRepository = UserRepository(docClient);

const userServiceInstance = UserService(userRepository);
const refreshTokenServiceInstance = RefreshTokenService(refreshTokenRepository);

const authenticationServiceInstance: IAuthenticationService =
  AuthenticationService(userServiceInstance, refreshTokenServiceInstance);
const authenticationControllerInstance = AuthenticationController(
  authenticationServiceInstance
);

router.post(
  '/register/email',
  registerInitAuthorizationMiddleware,
  registerInitSessionMiddleware,
  authenticationControllerInstance.registerUserByEmail
);
// TODO: Start with this
router.post(
  '/register/oauth',
  registerInitAuthorizationMiddleware,
  registerInitSessionMiddleware,
  authenticationControllerInstance.registerUserByOAuth
);
router.post('/login', authenticationControllerInstance.loginUser);
router.post('/refresh', authenticationControllerInstance.refreshAccessToken);
router.post('/logout', authenticationControllerInstance.logoutUser);
router.post('/verify', authenticationControllerInstance.verifyAccessToken);

export default router;
