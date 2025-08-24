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

router.post('/sync', authorizationMiddleware, todoControllerInstance.syncTodos);
router.post('/', todoControllerInstance.createTodo);
router.get('/:userId', todoControllerInstance.findTodosInfoByUserId);
router.put('/:id/:userId', todoControllerInstance.updateTodo);
router.delete('/:id/:userId', todoControllerInstance.deleteTodo);

export default router;
