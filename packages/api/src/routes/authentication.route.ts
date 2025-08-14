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

const authServiceInstance: IAuthenticationService = AuthenticationService(
  userServiceInstance,
  refreshTokenServiceInstance
);
const authControllerInstance = AuthenticationController(authServiceInstance);

router.post('/register', authControllerInstance.registerUser);
router.post('/login', authControllerInstance.loginUser);
router.post('/refresh', authControllerInstance.refreshAccessToken);
router.post('/logout', authControllerInstance.logoutUser);

export default router;
