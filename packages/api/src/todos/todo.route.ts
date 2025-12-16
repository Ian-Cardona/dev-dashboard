import { docClient } from '../config/dynamodb';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';
import { accessAuthorizationMiddleware } from 'src/middlewares/authorization/access-authorization.middleware';

const router = Router();

const modelInstance = TodoRepository(docClient);
const serviceInstance = TodoService(modelInstance);
const controllerInstance = TodoController(serviceInstance);

const batchWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many batch operations.',
  standardHeaders: true,
  legacyHeaders: false,
});

const resolutionWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many resolution updates.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/batches',
  batchWriteLimiter,
  apiKeysMiddleware,
  controllerInstance.createBatch
);
router.get(
  '/batches',
  accessAuthorizationMiddleware,
  controllerInstance.getBatchesByUserId
);
router.get(
  '/batches/latest',
  accessAuthorizationMiddleware,
  controllerInstance.getLatestBatchByUserId
);
router.get(
  '/batches/recent',
  accessAuthorizationMiddleware,
  controllerInstance.getRecentBatchesByUserId
);
router.get(
  '/batches/:syncId',
  accessAuthorizationMiddleware,
  controllerInstance.getBatchByUserIdAndSyncId
);

router.get(
  '/projects',
  accessAuthorizationMiddleware,
  controllerInstance.getProjectsByUserId
);
router.get(
  '/projects/:projectName/batches',
  accessAuthorizationMiddleware,
  controllerInstance.getBatchesByUserIdAndProject
);

router.get(
  '/resolutions',
  accessAuthorizationMiddleware,
  controllerInstance.getResolved
);
router.get(
  '/resolutions/pending',
  accessAuthorizationMiddleware,
  controllerInstance.getPendingResolutionsByUserId
);
router.post(
  '/resolutions',
  resolutionWriteLimiter,
  accessAuthorizationMiddleware,
  controllerInstance.updateResolutionsAsResolved
);

export default router;
