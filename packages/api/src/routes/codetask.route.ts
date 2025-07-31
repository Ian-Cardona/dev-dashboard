import express from 'express';
import {
  createCodeTask,
  deleteCodeTask,
  findCodeTasksInfoByUserId,
  updateCodeTask,
} from '../controllers/codetask.controller';

const router = express.Router();

router.post('/', createCodeTask);

router.get('/:userId', findCodeTasksInfoByUserId);

router.put('/:userId/:id', updateCodeTask);

router.delete('/:userId/:id', deleteCodeTask);

export default router;
