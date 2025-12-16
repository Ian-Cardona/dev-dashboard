import { docClient } from '../../config/dynamodb';
import { UserService } from '../../user/user.service';
import { IRegisterInitService } from './interfaces/iregister-init.service';
import { RegisterInitController } from './register-init.controller';
import { RegisterInitService } from './register-init.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { redisClient } from 'src/config/redis';
import { UserRepository } from 'src/user/user.repository';

const router = Router();
const userRepository = UserRepository(docClient);

const userServiceInstance = UserService(userRepository);

const registerInitServiceInstance: IRegisterInitService = RegisterInitService(
  redisClient,
  userServiceInstance
);

const registerInitControllerInstance = RegisterInitController(
  registerInitServiceInstance
);

const initLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const sessionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: 'Too many requests.',
});

router.get(
  '/email/session',
  sessionLimiter,
  registerInitControllerInstance.getEmailSession
);
router.get(
  '/oauth/session',
  sessionLimiter,
  registerInitControllerInstance.getOAuthSession
);
router.post('/email', initLimiter, registerInitControllerInstance.email);
router.post('/github', initLimiter, registerInitControllerInstance.github);

export default router;
