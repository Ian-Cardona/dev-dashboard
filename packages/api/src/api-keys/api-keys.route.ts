import { docClient } from '../config/dynamodb';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysModel } from './api-keys.model';
import { ApiKeysService } from './api-keys.service';
import { Router } from 'express';
import { accessAuthorizationMiddleware } from 'src/middlewares/access-authorization.middleware';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';

const router = Router();

const modelInstance = ApiKeysModel(docClient);
const serviceInstance = ApiKeysService(modelInstance);
const controllerInstance = ApiKeysController(serviceInstance);

router.get(
  '/list',
  accessAuthorizationMiddleware,
  controllerInstance.findByUserId
);
router.post(
  '/create',
  accessAuthorizationMiddleware,
  controllerInstance.create
);
router.get('/check', apiKeysMiddleware, controllerInstance.check);

export default router;
