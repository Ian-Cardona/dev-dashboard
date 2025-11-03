import { GithubIntegrationController } from './github.controller';
import { GithubIntegrationRepository } from './github.repository';
import { GithubIntegrationService } from './github.service';
import { Router } from 'express';
import { accessAuthorizationMiddleware } from 'src/middlewares/authorization/access-authorization.middleware';
import { githubSessionMiddleware } from 'src/middlewares/github-session.middleware';

const router = Router();

const repository = GithubIntegrationRepository();
const service = GithubIntegrationService(repository);
const controller = GithubIntegrationController(service);

router.get(
  '/github/user/repositories',
  accessAuthorizationMiddleware,
  githubSessionMiddleware,
  controller.listUserRepositories
);
router.get(
  '/github/user/workflow/latest/:owner/:repo',
  accessAuthorizationMiddleware,
  githubSessionMiddleware,
  controller.getLatestWorkflowRun
);

export default router;
