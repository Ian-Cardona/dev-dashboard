import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserModel } from '../models/user.model';
import { RefreshTokenModel } from '../models/refreshToken.model';

const router = Router();

const userModel = UserModel(docClient);
const refreshTokenModel = RefreshTokenModel(docClient);

const authServiceInstance = AuthService(userModel, refreshTokenModel);
const authControllerInstance = AuthController(authServiceInstance);

router.post('/register', authControllerInstance.registerUser);
router.post('/login', authControllerInstance.loginUser);
router.post('/refresh', authControllerInstance.refreshAccessToken);
router.post('/logout', authControllerInstance.logoutUser);

export default router;
