import { docClient } from '../../config/dynamodb';
import { UserService } from '../../user/user.service';
import { IRegisterInitService } from './interfaces/iregister-init.service';
import { RegisterInitController } from './register-init.controller';
import { RegisterInitService } from './register-init.service';
import { Router } from 'express';
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

router.get('/email/session', registerInitControllerInstance.getEmailSession);
router.post('/email', registerInitControllerInstance.email);
router.post('/github', registerInitControllerInstance.github);

export default router;
