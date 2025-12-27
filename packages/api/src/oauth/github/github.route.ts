import { GithubController } from './github.controller';
import { GithubRepository } from './github.repository';
import { GithubService } from './github.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { RegisterInitService } from 'src/auth-related/register-init/register-init.service';
import { docClient } from 'src/config/dynamodb';
import { redisClient } from 'src/config/redis';
import { conditionalAccessAuthorizationMiddleware } from 'src/middlewares/authorization/conditional-access-authorization.middleware';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

const router = Router();

const githubRepository = GithubRepository();
const userRepository = UserRepository(docClient);
const userService = UserService(userRepository);

const registerInitService = RegisterInitService(redisClient, userService);
const githubService = GithubService(githubRepository);
const controller = GithubController(
  githubService,
  registerInitService,
  userService
);

const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many OAuth attempts.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  '/authorize/callback',
  oauthLimiter,
  conditionalAccessAuthorizationMiddleware,
  controller.getAuthorizationCallbackUrl
);

router.get('/authorize/link', oauthLimiter, controller.getAuthorizeLink);

export default router;
