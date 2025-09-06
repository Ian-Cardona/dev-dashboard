import { ITodoModel } from './todo.model';
import { generateUUID } from '../utils/uuid.utils';
import {
  TodoMeta,
  TodoBatch,
  ProjectNames,
  TodosInfo,
  RawTodoBatch,
  RawTodo,
  Todo,
} from '@dev-dashboard/shared';

export interface ITodoService {
  create(userId: string, batch: RawTodoBatch): Promise<TodosInfo>;
  findByUserId(userId: string): Promise<TodosInfo>;
  findByUserIdAndSyncId(userId: string, syncId: string): Promise<TodosInfo>;
  findLatestByUserId(userId: string): Promise<TodosInfo | null>;
  findRecentByUserId(userId: string, limit?: number): Promise<TodosInfo>;
  findProjectsByUserId(userId: string): Promise<ProjectNames>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodosInfo>;
}

export const TodoService = (TodoModel: ITodoModel): ITodoService => {
  const transformTodos = (todos: RawTodo[]): Todo[] => {
    return todos.map(todo => ({
      id: generateUUID(),
      resolved: false,
      ...todo,
    }));
  };

  const createTodosInfoResponse = (
    userId: string,
    batches: TodoBatch[]
  ): TodosInfo => {
    const allTodos = batches.flatMap(batch => batch.todos);

    const scannedFiles = new Set(allTodos.map(todo => todo.filePath)).size;

    const lastScanAt =
      batches.length > 0
        ? batches.reduce((latest, current) =>
            new Date(latest.syncedAt) > new Date(current.syncedAt)
              ? latest
              : current
          ).syncedAt
        : new Date(0).toISOString();

    const meta: TodoMeta = {
      totalCount: allTodos.length,
      lastScanAt,
      scannedFiles,
    };

    return {
      userId,
      todosBatches: batches,
      meta,
    };
  };

  return {
    async create(userId: string, rawBatch: RawTodoBatch): Promise<TodosInfo> {
      try {
        const { todos, projectName } = rawBatch;

        const todosToSave = transformTodos(todos);

        const batchToDb: TodoBatch = {
          userId,
          syncId: generateUUID(),
          syncedAt: new Date().toISOString(),
          projectName,
          todos: todosToSave,
        };

        await TodoModel.create(batchToDb);

        return createTodosInfoResponse(userId, [batchToDb]);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },

    async findByUserId(userId: string): Promise<TodosInfo> {
      try {
        const batches = await TodoModel.findByUserId(userId);

        return createTodosInfoResponse(userId, batches);
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
        const batch = await TodoModel.findByUserIdAndSyncId(userId, syncId);
        if (!batch) {
          return createTodosInfoResponse(userId, []);
        }

        return createTodosInfoResponse(userId, [batch]);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async findLatestByUserId(userId: string): Promise<TodosInfo | null> {
      try {
        const batch = await TodoModel.findLatestByUserId(userId);
        if (!batch) return null;

        return createTodosInfoResponse(userId, [batch]);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async findRecentByUserId(
      userId: string,
      limit: number = 10
    ): Promise<TodosInfo> {
      try {
        const batches = await TodoModel.findRecentByUserId(userId, limit);
        return createTodosInfoResponse(userId, batches);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve tasks');
      }
    },

    async findProjectsByUserId(userId: string): Promise<ProjectNames> {
      try {
        return await TodoModel.findProjectsByUserId(userId);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve projects');
      }
    },

    async findByUserIdAndProject(
      userId: string,
      projectName: string,
      limit: number = 100
    ): Promise<TodosInfo> {
      try {
        const batches = await TodoModel.findByUserIdAndProject(
          userId,
          projectName,
          limit
        );
        return createTodosInfoResponse(userId, batches);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to retrieve tasks by project');
      }
    },
  };
};
