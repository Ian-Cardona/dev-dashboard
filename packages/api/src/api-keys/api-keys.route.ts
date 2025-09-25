import { docClient } from '../config/dynamodb';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysModel } from './api-keys.model';
import { ApiKeysService } from './api-keys.service';
import { Router } from 'express';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';
import { authorizationMiddleware } from 'src/middlewares/authorization.middleware';

const router = Router();

const modelInstance = ApiKeysModel(docClient);
const serviceInstance = ApiKeysService(modelInstance);
const controllerInstance = ApiKeysController(serviceInstance);

router.get('/list', authorizationMiddleware, controllerInstance.findByUserId);
router.post('/create', authorizationMiddleware, controllerInstance.create);
router.get('/check', apiKeysMiddleware, controllerInstance.check);

export default router;
