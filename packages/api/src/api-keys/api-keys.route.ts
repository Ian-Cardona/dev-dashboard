import { docClient } from '../config/dynamodb';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysRepository } from './api-keys.repository';
import { ApiKeysService } from './api-keys.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';
import { accessAuthorizationMiddleware } from 'src/middlewares/authorization/access-authorization.middleware';

const router = Router();

const repository = ApiKeysRepository(docClient);
const service = ApiKeysService(repository);
const controller = ApiKeysController(service);

const apiKeyWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many API key operations.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiKeyCheckLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many API key checks.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/list', accessAuthorizationMiddleware, controller.findByUserId);
router.post(
  '/create',
  apiKeyWriteLimiter,
  accessAuthorizationMiddleware,
  controller.create
);
router.get('/check', apiKeyCheckLimiter, apiKeysMiddleware, controller.check);
router.put(
  '/revoke/:id',
  apiKeyWriteLimiter,
  accessAuthorizationMiddleware,
  controller.revoke
);

export default router;
