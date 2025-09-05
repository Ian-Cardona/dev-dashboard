import { ITodoModel } from './todo.model';
import { generateUUID } from '../utils/uuid.utils';
import {
  TodoMeta,
  TodoBatch,
  rawTodoBatchSchema,
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
  findLatestByUserId(userId: string): Promise<TodosInfo>;
  findRecentByUserId(userId: string, limit?: number): Promise<TodosInfo>;
  findProjectsByUserId(userId: string): Promise<ProjectNames>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodosInfo>;
  update(
    syncId: string,
    userId: string,
    updates: Partial<TodoBatch>
  ): Promise<void>;
  delete(syncId: string, userId: string): Promise<void>;
}

export const TodoService = (TodoModel: ITodoModel): ITodoService => {
  const transformTodos = async (todos: RawTodo[]): Promise<Todo[]> => {
    return Promise.all(
      todos.map(todo => ({
        id: generateUUID(),
        resolved: false,
        ...todo,
      }))
    );
  };

  return {
    async create(userId: string, rawBatch: RawTodoBatch): Promise<TodosInfo> {
      try {
        const validatedBatch = rawTodoBatchSchema.parse(rawBatch);
        const { todos, projectName, userId } = validatedBatch;

        const todosToSave = await transformTodos(todos);

        const syncId = generateUUID();
        const syncedAt = new Date().toISOString();

        const batchToDb: TodoBatch = {
          userId,
          syncId,
          syncedAt,
          projectName,
          todos: todosToSave,
        };

        await TodoModel.create(batchToDb);

        const scannedFiles = new Set(todosToSave.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: todosToSave.length,
          lastScanAt: syncedAt,
          scannedFiles,
        };

        const batchInfo: TodosInfo = {
          userId,
          todosBatch: batchToDb,
          meta,
        };

        return batchInfo;
      } catch (error) {
        console.log(error);
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },

    async findByUserId(userId: string): Promise<TodosInfo> {
      try {
        const batch = await TodoModel.findByUserId(userId);

        const scannedFiles = new Set(batch.todos.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: batch.todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        return {
          userId,
          batch,
          meta,
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
        const batch = await TodoModel.findByUserIdAndSyncId(userId, syncId);
        const scannedFiles = new Set(batch.todos.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: batch.todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        return {
          userId,
          batch,
          meta,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async findLatestByUserId(userId: string): Promise<TodosInfo> {
      try {
        const batch = await TodoModel.findLatestByUserId(userId);
        const scannedFiles = new Set(batch.todos.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: batch.todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        return {
          userId,
          batch,
          meta,
        };
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
        const batch = await TodoModel.findRecentByUserId(userId, limit);
        const scannedFiles = new Set(batch.todos.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: batch.todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        return {
          userId,
          batch,
          meta,
        };
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
        const batch = await TodoModel.findByUserIdAndProject(
          userId,
          projectName,
          limit
        );
        const scannedFiles = new Set(batch.todos.map(item => item.filePath))
          .size;

        const meta: TodoMeta = {
          userId,
          totalCount: batch.todos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        return {
          userId,
          batch,
          meta,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to retrieve tasks by project');
      }
    },

    // async update(syncId: string, userId: string, updates: Partial<TodoBatch>) {
    //   try {
    //     await TodoModel.update(syncId, userId, updates);
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       throw error;
    //     }

    //     if (error instanceof ConditionalCheckFailedException) {
    //       throw new NotFoundError(`Task batch with syncId not found.`);
    //     }

    //     throw new Error('Could not update the task batch.');
    //   }
    // },

    // async delete(syncId: string, userId: string): Promise<void> {
    //   try {
    //     await TodoModel.delete(syncId, userId);
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       throw error;
    //     }

    //     if (error instanceof ConditionalCheckFailedException) {
    //       throw new NotFoundError(`Task batch with syncId not found.`);
    //     }

    //     throw new Error('Could not delete the task batch.');
    //   }
    // },
  };
};
