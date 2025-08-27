import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { TodoModel } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { TodoController } from '../controllers/todo.controller';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';

const router = Router();

const todoRepositoryInstance = TodoModel(docClient);
const todoServiceInstance = TodoService(todoRepositoryInstance);
const todoControllerInstance = TodoController(todoServiceInstance);

router.post('/', authorizationMiddleware, todoControllerInstance.syncTodos);
router.get(
  '/latest',
  authorizationMiddleware,
  todoControllerInstance.findLatestByUserId
);
router.get(
  '/:syncId',
  authorizationMiddleware,
  todoControllerInstance.findByUserIdAndSyncId
);

export default router;
