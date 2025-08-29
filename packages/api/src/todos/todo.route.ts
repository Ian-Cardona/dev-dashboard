import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { TodoModel } from './todo.model';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

const router = Router();

const modelInstance = TodoModel(docClient);
const serviceInstance = TodoService(modelInstance);
const controllerInstance = TodoController(serviceInstance);

router.post('/', controllerInstance.syncTodos);
router.get('/latest', controllerInstance.findLatestByUserId);
router.get('/:syncId', controllerInstance.findByUserIdAndSyncId);

export default router;
