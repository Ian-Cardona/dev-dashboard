import { docClient } from '../../config/dynamodb';
import { UserService } from '../../user/user.service';
import { RefreshTokenRepository } from '../refresh-token/refresh-token.repository';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { onboardingSessionMiddleware } from 'src/middlewares/authentication/onboarding-session.middleware';
import { onboardingValidateTokenMiddleware } from 'src/middlewares/authentication/onboarding-validate-token.middleware';
import { UserRepository } from 'src/user/user.repository';

const router = Router();

const refreshTokenRepository = RefreshTokenRepository(docClient);
const userRepository = UserRepository(docClient);

const userServiceInstance = UserService(userRepository);
const refreshTokenServiceInstance = RefreshTokenService(refreshTokenRepository);

const authenticationServiceInstance: IAuthenticationService =
  AuthenticationService(userServiceInstance, refreshTokenServiceInstance);
const authenticationControllerInstance = AuthenticationController(
  authenticationServiceInstance
);

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Too many refresh attempts.',
});

router.post(
  '/register/email',
  strictAuthLimiter,
  onboardingValidateTokenMiddleware,
  onboardingSessionMiddleware,
  authenticationControllerInstance.completeRegisterUserByEmail
);
router.post(
  '/register/oauth',
  strictAuthLimiter,
  onboardingValidateTokenMiddleware,
  onboardingSessionMiddleware,
  authenticationControllerInstance.completeRegisterUserByOAuth
);
router.post(
  '/login/email',
  strictAuthLimiter,
  authenticationControllerInstance.loginUserByEmail
);
router.post(
  '/login/oauth',
  strictAuthLimiter,
  authenticationControllerInstance.loginUserByOAuth
);
router.post(
  '/refresh',
  refreshLimiter,
  authenticationControllerInstance.refreshAccessToken
);
router.post('/logout', authenticationControllerInstance.logoutUser);
router.post('/verify', authenticationControllerInstance.verifyAccessToken);

export default router;
