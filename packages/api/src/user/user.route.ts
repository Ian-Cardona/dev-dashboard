import { docClient } from '../config/dynamodb';
import { UserController } from './user.controller';
import { IUserModel, UserModel } from './user.model';
import { IUserService, UserService } from './user.service';
import { Router } from 'express';

const router = Router();

const userRepositoryInstance: IUserModel = UserModel(docClient);
const userServiceInstance: IUserService = UserService(userRepositoryInstance);
const userControllerInstance = UserController(userServiceInstance);

router.get('/profile', userControllerInstance.getUserProfile);
router.put('/profile', userControllerInstance.updateUserAccount);
router.put('/password', userControllerInstance.updateUserPassword);
router.delete('/account', userControllerInstance.deactivateUserAccount);

export default router;
