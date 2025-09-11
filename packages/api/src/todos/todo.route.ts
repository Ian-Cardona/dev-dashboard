import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { TodoModel } from './todo.model';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';
import { authorizationMiddleware } from 'src/middlewares/authorization.middleware';

const router = Router();

const modelInstance = TodoModel(docClient);
const serviceInstance = TodoService(modelInstance);
const controllerInstance = TodoController(serviceInstance);

router.post('/batches', apiKeysMiddleware, controllerInstance.createBatch);
router.get(
  '/batches',
  authorizationMiddleware,
  controllerInstance.getBatchesByUserId
);

router.get(
  '/batches/latest',
  authorizationMiddleware,
  controllerInstance.getLatestBatchByUserId
);
router.get(
  '/batches/recent',
  authorizationMiddleware,
  controllerInstance.getRecentBatchesByUserId
);

router.get(
  '/batches/:syncId',
  authorizationMiddleware,
  controllerInstance.getBatchByUserIdAndSyncId
);

router.get(
  '/projects',
  authorizationMiddleware,
  controllerInstance.getProjectsByUserId
);
router.get(
  '/projects/:projectName/batches',
  authorizationMiddleware,
  controllerInstance.getBatchesByUserIdAndProject
);

router.get(
  '/resolutions/pending',
  authorizationMiddleware,
  controllerInstance.getPendingResolutionsByUserId
);
router.post(
  '/resolutions',
  authorizationMiddleware,
  controllerInstance.updateResolutionsAsResolved
);

export default router;
