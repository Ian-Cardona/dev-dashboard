import { GithubIntegrationController } from './github.controller';
import { GithubIntegrationRepository } from './github.repository';
import { GithubIntegrationService } from './github.service';
import { Router } from 'express';

const router = Router();

const repository = GithubIntegrationRepository();
const service = GithubIntegrationService(repository);
const controller = GithubIntegrationController(service);

router.get('/github/user/repositories', controller.listUserRepositories);
router.get('/github/user/workflow/latest', controller.getLatestWorkflowRun);

export default router;
