import { docClient } from '../config/dynamodb';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysRepository } from './api-keys.repository';
import { ApiKeysService } from './api-keys.service';
import { Router } from 'express';
import { apiKeysMiddleware } from 'src/middlewares/api-keys.middleware';
import { accessAuthorizationMiddleware } from 'src/middlewares/authorization/access-authorization.middleware';

const router = Router();

const repository = ApiKeysRepository(docClient);
const service = ApiKeysService(repository);
const controller = ApiKeysController(service);

router.get('/list', accessAuthorizationMiddleware, controller.findByUserId);
router.post('/create', accessAuthorizationMiddleware, controller.create);
router.get('/check', apiKeysMiddleware, controller.check);
router.put('/revoke/:id', accessAuthorizationMiddleware, controller.revoke);

export default router;
