import { CodeTask, CodeTasksInfo } from '../types/codetask.type';
import { ICodeTaskModel } from '../models/codetask.model';
import { ENV } from '../config/env_variables';

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
  create(data: CodeTask): Promise<CodeTask>;
  findByUserId(userId: string): Promise<CodeTasksInfo>;
  update(id: string, userId: string, updates: Partial<CodeTask>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const CodeTaskService = (
  codeTaskModel: ICodeTaskModel
): ICodeTaskService => {
  return {
    async create(data: CodeTask): Promise<CodeTask> {
      try {
        return await codeTaskModel.create(data);
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

    async update(
      id: string,
      userId: string,
      updates: Partial<CodeTask>
    ): Promise<void> {
      try {
        await codeTaskModel.update(id, userId, updates);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'ConditionalCheckFailedException'
        ) {
          console.warn(`Attempted to update a non-existent task: ${id}`);
          throw new NotFoundError(`Task with ID ${id} not found.`);
        }

        if (ENV.NODE_ENV === 'development') {
          console.error(`Service Error: Failed to update task ${id}.`, error);
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
