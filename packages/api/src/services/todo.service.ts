import {
  CreateTodo,
  TodoMeta,
  RawTodo,
  Todo,
  TodosInfo,
} from '../../../shared/src/types/todo.type';
import { ITodoModel } from '../models/todo.model';
import { generateUUID } from '../utils/uuid.utils';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { NotFoundError } from '../utils/errors.utils';
import { todoSchema } from '../../../shared/src/schemas/todo.schema';

export interface ITodoService {
  syncTodos(userId: string, data: RawTodo[]): Promise<TodosInfo>;
  create(data: CreateTodo): Promise<Todo>;
  findByUserId(userId: string): Promise<TodosInfo>;
  findByUserIdAndSyncId(userId: string, syncId: string): Promise<TodosInfo>;
  findLatestByUserId(userId: string): Promise<TodosInfo>;
  update(id: string, userId: string, updates: Partial<Todo>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const TodoService = (TodoModel: ITodoModel): ITodoService => {
  const processRawTodo = async (
    userId: string,
    syncId: string,
    item: RawTodo
  ): Promise<Todo> => {
    return todoSchema.parse({
      ...item,
      userId,
      id: generateUUID(),
      syncedAt: new Date().toISOString(),
      syncId,
    });
  };

  return {
    async syncTodos(userId: string, data: RawTodo[]): Promise<TodosInfo> {
      try {
        const syncId = generateUUID();
        const processedTodos = await Promise.all(
          data.map(item => processRawTodo(userId, syncId, item))
        );
        await TodoModel.batchCreate(processedTodos);

        const scannedFiles = new Set(data.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: processedTodos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          data: processedTodos,
          meta,
        };

        console.log('Todos synced successfully:', todosInfo);

        return todosInfo;
      } catch (error) {
        console.log(error);
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },

    async create(data: CreateTodo): Promise<Todo> {
      try {
        const newTask: Todo = {
          ...data,
          id: generateUUID(),
          syncedAt: new Date().toISOString(),
        };

        return await TodoModel.create(newTask);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to create task');
      }
    },

    async findByUserId(userId: string): Promise<TodosInfo> {
      try {
        const data = await TodoModel.findByUserId(userId);

        return {
          userId,
          data,
          meta: {
            userId,
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

    async findByUserIdAndSyncId(
      userId: string,
      syncId: string
    ): Promise<TodosInfo> {
      try {
        const data = await TodoModel.findByUserIdAndSyncId(userId, syncId);
        const scannedFiles = new Set(data.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: data.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          data,
          meta,
        };

        return todosInfo;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async findLatestByUserId(userId: string): Promise<TodosInfo> {
      try {
        const data = await TodoModel.findLatestByUserId(userId);
        const scannedFiles = new Set(data.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: data.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          data,
          meta,
        };

        return todosInfo;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async update(id: string, userId: string, updates: Partial<Todo>) {
      try {
        await TodoModel.update(id, userId, updates);
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
        await TodoModel.delete(id, userId);
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
