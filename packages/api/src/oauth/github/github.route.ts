import { GithubController } from './github.controller';
import { GithubRepository } from './github.repository';
import { GithubService } from './github.service';
import { Router } from 'express';
import { RegisterInitService } from 'src/auth-related/register-init/register-init.service';
import { docClient } from 'src/config/dynamodb';
import { redisClient } from 'src/config/redis';
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

router.get('/authorize/callback', controller.getAuthorizationCallbackUrl);
router.get('/authorize/link', controller.getAuthorizeLink);

export default router;
