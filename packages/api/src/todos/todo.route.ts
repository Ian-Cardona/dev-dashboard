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

router.post('/', apiKeysMiddleware, controllerInstance.createBatch);
router.get('/', authorizationMiddleware, controllerInstance.findByUserId);

router.get(
  '/latest',
  authorizationMiddleware,
  controllerInstance.findLatestByUserId
);
router.get(
  '/recent',
  authorizationMiddleware,
  controllerInstance.findRecentByUserId
);
router.get(
  '/projects',
  authorizationMiddleware,
  controllerInstance.findProjectsByUserId
);
router.get(
  '/projects/:projectName',
  authorizationMiddleware,
  controllerInstance.findByUserIdAndProjectName
);

router.get(
  '/resolutions/pending',
  authorizationMiddleware,
  controllerInstance.findPendingResolutionsByUserId
);
router.post(
  '/resolutions',
  authorizationMiddleware,
  controllerInstance.createResolution
);
router.get(
  '/resolutions/compare/:projectName',
  authorizationMiddleware,
  controllerInstance.compareLatestBatches
);

router.get(
  '/:syncId',
  authorizationMiddleware,
  controllerInstance.findByUserIdAndSyncId
);

export default router;
