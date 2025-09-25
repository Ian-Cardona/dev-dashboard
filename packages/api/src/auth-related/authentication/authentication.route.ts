import { docClient } from '../../config/dynamodb';
import { UserModel } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { RefreshTokenModel } from '../refresh-token/refresh-token.model';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { IAuthenticationService } from './authentication.service';
import { Router } from 'express';

const router = Router();

const refreshTokenModel = RefreshTokenModel(docClient);
const userModel = UserModel(docClient);

const userServiceInstance = UserService(userModel);
const refreshTokenServiceInstance = RefreshTokenService(refreshTokenModel);

const authenticationServiceInstance: IAuthenticationService =
  AuthenticationService(userServiceInstance, refreshTokenServiceInstance);
const authenticationControllerInstance = AuthenticationController(
  authenticationServiceInstance
);

router.post('/register', authenticationControllerInstance.registerUser);
router.post('/login', authenticationControllerInstance.loginUser);
router.post('/refresh', authenticationControllerInstance.refreshAccessToken);
router.post('/logout', authenticationControllerInstance.logoutUser);
router.post('/verify', authenticationControllerInstance.verifyAccessToken);

export default router;
