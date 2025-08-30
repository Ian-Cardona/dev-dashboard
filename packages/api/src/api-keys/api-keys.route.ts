import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysModel } from './api-keys.model';
import { authorizationMiddleware } from 'src/middlewares/authorization.middleware';

const router = Router();

const modelInstance = ApiKeysModel(docClient);
const serviceInstance = ApiKeysService(modelInstance);
const controllerInstance = ApiKeysController(serviceInstance);

router.post('/', authorizationMiddleware, controllerInstance.create);

export default router;
