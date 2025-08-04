import {
  CodeTask,
  CodeTasksInfo,
  OtherCodeTask,
  PredefinedCodeTask,
} from '../types/codetask.type';
import { ICodeTaskModel } from '../models/codetask.model';
import { logger } from '../middlewares/logger.middleware';
import { generateCodeTaskId } from '../utils/uuid.utils';
import {
  ConditionalCheckFailedException,
  DynamoDBServiceException,
} from '@aws-sdk/client-dynamodb';
import { DatabaseError, NotFoundError } from '../utils/errors.utils';

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

  async function handleServiceCall<T>(
    fn: () => Promise<T>,
    context: object,
    errorMessage: string,
    errorClass = DatabaseError
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(errorMessage, {
          error: error.message,
          stack: error.stack,
          ...context,
        });
      }

      throw new errorClass(errorMessage);
    }
  }

  return {
    async create(data: Omit<CodeTask, 'id' | 'syncedAt'>): Promise<CodeTask> {
      return handleServiceCall(
        async () => {
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
        },
        { data },
        'Service Error: Failed to create code task',
        DatabaseError
      );
    },

    async findByUserId(userId: string): Promise<CodeTasksInfo> {
      return handleServiceCall(
        async () => {
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
        },
        { userId },
        'Could not retrieve tasks.',
        DatabaseError
      );
    },

    async update(id: string, userId: string, updates: Partial<CodeTask>) {
      try {
        await codeTaskModel.update(id, userId, updates);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to update task', {
            error: error.message,
            stack: error.stack,
            id,
            userId,
            updates,
          });
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID ${id} not found.`);
        }

        if (error instanceof DynamoDBServiceException) {
          throw new DatabaseError(`Database update failed: ${error.message}`);
        }

        throw new DatabaseError('Could not update the task.');
      }
    },

    async delete(id: string, userId: string): Promise<void> {
      try {
        await codeTaskModel.delete(id, userId);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to delete task', {
            error: error.message,
            stack: error.stack,
            id,
            userId,
          });
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID ${id} not found.`);
        }

        throw new DatabaseError('Could not delete the task.');
      }
    },
  };
};
