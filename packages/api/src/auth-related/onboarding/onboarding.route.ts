import { docClient } from '../../config/dynamodb';
import { UserService } from '../../user/user.service';
import { IOnboardingService } from './interfaces/ionboarding.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { Router } from 'express';
import { redisClient } from 'src/config/redis';
import { UserRepository } from 'src/user/user.repository';

const router = Router();
const userRepository = UserRepository(docClient);

const userServiceInstance = UserService(userRepository);

const onboardingServiceInstance: IOnboardingService = OnboardingService(
  redisClient,
  userServiceInstance
);

const onboardingControllerInstance = OnboardingController(
  onboardingServiceInstance
);

router.post(
  '/initiate/email',
  onboardingControllerInstance.initiateEmailOnboarding
);

export default router;
