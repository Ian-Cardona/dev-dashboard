import { docClient } from '../config/dynamodb';
import { IUserRepository } from './interfaces/iuser.repository';
import { IUserService } from './interfaces/iuser.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Router } from 'express';

const router = Router();

const userRepositoryInstance: IUserRepository = UserRepository(docClient);
const userServiceInstance: IUserService = UserService(userRepositoryInstance);
const userControllerInstance = UserController(userServiceInstance);

router.get('/profile', userControllerInstance.getUserProfile);
router.put('/profile', userControllerInstance.updateUserAccount);
router.put('/password', userControllerInstance.updateUserPassword);
router.delete('/account', userControllerInstance.deactivateUserAccount);

export default router;
