import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { IUserModel, UserModel } from '../models/user.model';
import { IUserService, UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';

const router = Router();

const userRepositoryInstance: IUserModel = UserModel(docClient);
const userServiceInstance: IUserService = UserService(userRepositoryInstance);
const userControllerInstance = UserController(userServiceInstance);

router.get(
  '/profile',
  authorizationMiddleware,
  userControllerInstance.getUserProfile
);
router.put(
  '/profile',
  authorizationMiddleware,
  userControllerInstance.updateUserAccount
);
router.put(
  '/password',
  authorizationMiddleware,
  userControllerInstance.updateUserPassword
);
router.delete(
  '/account',
  authorizationMiddleware,
  userControllerInstance.deactivateUserAccount
);

export default router;
