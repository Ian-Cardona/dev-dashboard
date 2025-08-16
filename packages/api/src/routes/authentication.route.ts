import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationController } from '../controllers/authentication.controller';
import { IAuthenticationService } from '../services/authentication.service';

import { UserModel } from '../models/user.model';
import { RefreshTokenModel } from '../models/refreshToken.model';
import { UserService } from '../services/user.service';
import { RefreshTokenService } from '../services/refreshToken.service';

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

export default router;
