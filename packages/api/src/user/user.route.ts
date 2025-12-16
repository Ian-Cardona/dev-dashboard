import { docClient } from '../config/dynamodb';
import { IUserRepository } from './interfaces/iuser.repository';
import { IUserService } from './interfaces/iuser.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const userRepositoryInstance: IUserRepository = UserRepository(docClient);
const userServiceInstance: IUserService = UserService(userRepositoryInstance);
const userControllerInstance = UserController(userServiceInstance);

const sensitiveWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many update requests.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/profile', userControllerInstance.getUserProfile);
router.get('/profile/providers', userControllerInstance.findProvidersByUserId);

router.put(
  '/profile',
  profileUpdateLimiter,
  userControllerInstance.updateUserAccount
);

router.put(
  '/password',
  sensitiveWriteLimiter,
  userControllerInstance.updateUserPassword
);
router.delete(
  '/account',
  sensitiveWriteLimiter,
  userControllerInstance.deactivateUserAccount
);

export default router;
