import { docClient } from '../config/dynamodb';
import { TodoController } from './todo.controller';
import { TodoModel } from './todo.model';
import { TodoService } from './todo.service';
import { Router } from 'express';
import { accessAuthorizationMiddleware } from 'src/middlewares/access-authorization.middleware';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';

const router = Router();

const modelInstance = TodoModel(docClient);
const serviceInstance = TodoService(modelInstance);
const controllerInstance = TodoController(serviceInstance);

router.post('/batches', apiKeysMiddleware, controllerInstance.createBatch);
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
  accessAuthorizationMiddleware,
  controllerInstance.updateResolutionsAsResolved
);

export default router;
