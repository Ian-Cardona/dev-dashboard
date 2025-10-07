import { GithubController } from './github.controller';
import { GithubRepository } from './github.repository';
import { GithubService } from './github.service';
import { Router } from 'express';

const router = Router();

const repository = GithubRepository();
const service = GithubService(repository);
const controller = GithubController(service);

router.get('/oauth/callback', controller.githubAuthCallback);

export default router;
