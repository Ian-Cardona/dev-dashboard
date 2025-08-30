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

router.post('/', apiKeysMiddleware, controllerInstance.syncTodos);
router.get(
  '/latest',
  authorizationMiddleware,
  controllerInstance.findLatestByUserId
);
router.get(
  '/:syncId',
  apiKeysMiddleware,
  controllerInstance.findByUserIdAndSyncId
);

export default router;
