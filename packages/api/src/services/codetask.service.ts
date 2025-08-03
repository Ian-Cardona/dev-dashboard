import {
  CodeTask,
  CodeTasksInfo,
  OtherCodeTask,
  PredefinedCodeTask,
} from '../types/codetask.type';
import { ICodeTaskModel } from '../models/codetask.model';
import { ENV } from '../config/env_variables';
import { generateCodeTaskId } from '../utils/uuid.utils';
import {
  ConditionalCheckFailedException,
  DynamoDBServiceException,
} from '@aws-sdk/client-dynamodb';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export interface ICodeTaskService {
  create(data: Omit<CodeTask, 'id' | 'syncedAt'>): Promise<CodeTask>;
  findByUserId(userId: string): Promise<CodeTasksInfo>;
  update(id: string, userId: string, updates: Partial<CodeTask>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const CodeTaskService = (
  codeTaskModel: ICodeTaskModel
): ICodeTaskService => {
  const createPredefinedTask = (
    data: Omit<PredefinedCodeTask, 'id' | 'syncedAt'>
  ): PredefinedCodeTask => ({
    ...data,
    id: generateCodeTaskId(),
    syncedAt: new Date().toISOString(),
  });

  const createOtherTask = (
    data: Omit<OtherCodeTask, 'id' | 'syncedAt'>
  ): OtherCodeTask => ({
    ...data,
    id: generateCodeTaskId(),
    syncedAt: new Date().toISOString(),
  });

  return {
    async create(data: Omit<CodeTask, 'id' | 'syncedAt'>): Promise<CodeTask> {
      try {
        let taskWithIds: CodeTask;

        if (data.type === 'OTHER') {
          taskWithIds = createOtherTask(
            data as Omit<OtherCodeTask, 'id' | 'syncedAt'>
          );
        } else {
          taskWithIds = createPredefinedTask(
            data as Omit<PredefinedCodeTask, 'id' | 'syncedAt'>
          );
        }

        return await codeTaskModel.create(taskWithIds);
      } catch (error) {
        // TODO: Implement better dev logging
        if (ENV.NODE_ENV === 'development') {
          console.error('Service Error: Failed to create code task.', error);
        }

        throw new DatabaseError('Could not create the task.');
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
        // TODO: Implement better dev logging
        if (ENV.NODE_ENV === 'development') {
          console.error('Service Error: Failed to retrieve tasks.', error);
        }

        throw new DatabaseError('Could not retrieve tasks.');
      }
    },

    async update(id: string, userId: string, updates: Partial<CodeTask>) {
      try {
        await codeTaskModel.update(id, userId, updates);
      } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
          console.warn(`Update failed for task ${id}: Not found`);
          throw new NotFoundError(`Task with ID ${id} not found.`);
        }

        if (error instanceof DynamoDBServiceException) {
          console.error(`DynamoDB error updating ${id}:`, error.name);
          throw new DatabaseError(`Database update failed: ${error.message}`);
        }

        throw new DatabaseError('Could not update the task.');
      }
    },

    async delete(id: string, userId: string): Promise<void> {
      try {
        await codeTaskModel.delete(id, userId);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'ConditionalCheckFailedException'
        ) {
          console.warn(`Attempted to delete a non-existent task: ${id}`);
          throw new NotFoundError(`Task with ID ${id} not found.`);
        }

        if (ENV.NODE_ENV === 'development') {
          console.error(`Service Error: Failed to delete task ${id}.`, error);
        }

        throw new DatabaseError('Could not delete the task.');
      }
    },
  };
};
