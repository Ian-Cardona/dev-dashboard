import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { CodeTaskModel } from '../models/codetask.model';
import { CodeTaskService } from '../services/codetask.service';
import { CodeTaskController } from '../controllers/codetask.controller';

const router = Router();

const codeTaskRepositoryInstance = CodeTaskModel(docClient);
const codeTaskServiceInstance = CodeTaskService(codeTaskRepositoryInstance);
const codeTaskControllerInstance = CodeTaskController(codeTaskServiceInstance);

router.post('/', codeTaskControllerInstance.createCodeTask);
router.get('/:userId', codeTaskControllerInstance.findCodeTasksInfoByUserId);
router.put('/:id/:userId', codeTaskControllerInstance.updateCodeTask);
router.delete('/:id/:userId', codeTaskControllerInstance.deleteCodeTask);

export default router;
