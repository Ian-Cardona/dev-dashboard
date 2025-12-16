import { GithubIntegrationController } from './github.controller';
import { GithubIntegrationRepository } from './github.repository';
import { GithubIntegrationService } from './github.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { accessAuthorizationMiddleware } from 'src/middlewares/authorization/access-authorization.middleware';
import { githubSessionMiddleware } from 'src/middlewares/github-session.middleware';

const router = Router();

const repository = GithubIntegrationRepository();
const service = GithubIntegrationService(repository);
const controller = GithubIntegrationController(service);

const githubApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many GitHub API requests.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  '/github/user/repositories',
  githubApiLimiter,
  accessAuthorizationMiddleware,
  githubSessionMiddleware,
  controller.getUserRepositories
);
router.get(
  '/github/user/workflow/latest/:owner/:repo',
  githubApiLimiter,
  accessAuthorizationMiddleware,
  githubSessionMiddleware,
  controller.getLatestWorkflowRun
);
router.get(
  '/github/user/notifications',
  githubApiLimiter,
  accessAuthorizationMiddleware,
  githubSessionMiddleware,
  controller.getUserNotifications
);

export default router;
