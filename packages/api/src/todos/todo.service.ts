import { ITodoModel } from './todo.model';
import { generateUUID } from '../utils/uuid.utils';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { NotFoundError } from '../utils/errors.utils';
import {
  CreateTodo,
  TodoMeta,
  Todo,
  TodosInfo,
  todoSchema,
  RawTodo,
  ProjectNames,
} from '@dev-dashboard/shared';

export interface ITodoService {
  sync(userId: string, data: RawTodo[]): Promise<TodosInfo>;
  create(data: CreateTodo): Promise<Todo>;
  findByUserId(userId: string): Promise<TodosInfo>;
  findByUserIdAndSyncId(userId: string, syncId: string): Promise<TodosInfo>;
  findLatestByUserId(userId: string): Promise<TodosInfo>;
  findRecentByUserId(userId: string, limit?: number): Promise<TodosInfo>;
  findProjectsByUserId(userId: string): Promise<ProjectNames>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodosInfo>;
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
    async sync(userId: string, data: RawTodo[]): Promise<TodosInfo> {
      try {
        const id = generateUUID();
        const todos = await Promise.all(
          data.map(item => processRawTodo(userId, id, item))
        );
        await TodoModel.batchCreate(todos);

        const scannedFiles = new Set(data.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          todos,
          meta,
        };

        return todosInfo;
      } catch (error) {
        console.log(error);
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },

    async create(data: CreateTodo): Promise<Todo> {
      try {
        const todo: Todo = {
          ...data,
          id: generateUUID(),
          syncedAt: new Date().toISOString(),
        };

        return await TodoModel.create(todo);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to create task');
      }
    },

    async findByUserId(userId: string): Promise<TodosInfo> {
      try {
        const todos = await TodoModel.findByUserId(userId);

        return {
          userId,
          todos,
          meta: {
            userId,
            totalCount: todos.length,
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
        const todos = await TodoModel.findByUserIdAndSyncId(userId, syncId);
        const scannedFiles = new Set(todos.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          todos,
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
        const todos = await TodoModel.findLatestByUserId(userId);
        const scannedFiles = new Set(todos.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          todos,
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

    async findRecentByUserId(
      userId: string,
      limit: number = 5
    ): Promise<TodosInfo> {
      try {
        const todos = await TodoModel.findRecentByUserId(userId, limit);
        const scannedFiles = new Set(todos.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          todos,
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

    async findProjectsByUserId(userId: string): Promise<ProjectNames> {
      try {
        const projects = await TodoModel.findProjectsByUserId(userId);
        return projects;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to retrieve projects');
      }
    },

    async findByUserIdAndProject(
      userId: string,
      projectName: string,
      limit: number = 100
    ): Promise<TodosInfo> {
      try {
        const todos = await TodoModel.findByUserIdAndProject(
          userId,
          projectName,
          limit
        );
        const scannedFiles = new Set(todos.map(item => item.filePath)).size;

        const meta: TodoMeta = {
          userId,
          totalCount: todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        const todosInfo: TodosInfo = {
          userId,
          todos,
          meta,
        };

        return todosInfo;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to retrieve tasks by project');
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
