import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

const router = Router();

const userRepositoryInstance = UserModel(docClient);
const userServiceInstance = UserService(userRepositoryInstance);
const userControllerInstance = UserController(userServiceInstance);

router.post('/', userControllerInstance.createUser);
router.get('/', userControllerInstance.findUserByEmail);
router.get('/:userId', userControllerInstance.findUserById);
router.patch('/:userId', userControllerInstance.updateUser);
router.delete('/:userId', userControllerInstance.deleteUser);
router.patch('/:userId/last-login', userControllerInstance.updateLastLogin);
router.patch('/:userId/password', userControllerInstance.updatePassword);
router.patch('/:userId/deactivate', userControllerInstance.deactivateUser);

export default router;
