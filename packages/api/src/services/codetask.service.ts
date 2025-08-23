import {
  CreateCodeTask,
  CodeTask,
  CodeTasksInfo,
} from '../../../shared/types/codetask.type';
import { ICodeTaskModel } from '../models/codetask.model';
import { generateUUID } from '../utils/uuid.utils';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { NotFoundError } from '../utils/errors.utils';

export interface ICodeTaskService {
  create(data: CreateCodeTask): Promise<CodeTask>;
  findByUserId(userId: string): Promise<CodeTasksInfo>;
  update(id: string, userId: string, updates: Partial<CodeTask>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const CodeTaskService = (
  codeTaskModel: ICodeTaskModel
): ICodeTaskService => {
  return {
    async create(data: CreateCodeTask): Promise<CodeTask> {
      try {
        const newTask: CodeTask = {
          ...data,
          id: generateUUID(),
          syncedAt: new Date().toISOString(),
          priority: data.priority || 'low',
          status: data.status || 'todo',
        };

        return await codeTaskModel.create(newTask);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to create task');
      }
    },

    async findByUserId(userId: string): Promise<CodeTasksInfo> {
      try {
        const data = await codeTaskModel.findByUserId(userId);

        return {
          userId,
          data,
          meta: {
            totalCount: data.length,
            lastScanAt: new Date().toISOString(),
            scannedFiles: 0,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async update(id: string, userId: string, updates: Partial<CodeTask>) {
      try {
        await codeTaskModel.update(id, userId, updates);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID not found.`);
        }

        throw new Error('Could not update the task.');
      }
    },

    async delete(id: string, userId: string): Promise<void> {
      try {
        await codeTaskModel.delete(id, userId);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID not found.`);
        }

        throw new Error('Could not delete the task.');
      }
    },
  };
};
