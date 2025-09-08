import crypto from 'crypto';
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
  TodoResolution,
  CreateResolutionRequest,
} from '@dev-dashboard/shared';

type ComparisonResult = {
  missing: Todo[];
  new: Todo[];
  persisted: Todo[];
};

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
  findPendingResolutionsByUserId(userId: string): Promise<TodoResolution[]>;
  compareLatestBatches(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<ComparisonResult>;
  createResolution(
    userId: string,
    partialResolution: CreateResolutionRequest
  ): Promise<TodoResolution>;
}

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

const generateDeterministicId = (
  projectName: string,
  todo: RawTodo
): string => {
  const normalizedContent = todo.content.trim().replace(/\s+/g, ' ');

  const base = `${projectName}|${todo.filePath}|${normalizedContent}`;
  return crypto.createHash('sha256').update(base).digest('hex');
};

const transformTodos = (projectName: string, todos: RawTodo[]): Todo[] => {
  return todos.map(todo => ({
    id: generateDeterministicId(projectName, todo),
    ...todo,
  }));
};

export const TodoService = (TodoModel: ITodoModel): ITodoService => {
  const createResolutionToSave = async (
    userId: string,
    partialResolution: CreateResolutionRequest
  ): Promise<TodoResolution> => {
    const batch = await TodoModel.findByUserIdAndSyncId(
      userId,
      partialResolution.syncId
    );

    if (!batch) {
      throw new Error('Batch not found');
    }

    const todo = batch.todos.find(t => t.id === partialResolution.id);

    if (!todo) {
      throw new Error('Todo not found in the specified batch');
    }

    const resolution: TodoResolution = {
      ...todo,
      userId,
      syncId: partialResolution.syncId,
      createdAt: new Date().toISOString(),
      resolved: true,
      resolvedAt: new Date().toISOString(),
      reason: partialResolution.reason,
    };

    return resolution;
  };

  return {
    async create(userId: string, rawBatch: RawTodoBatch): Promise<TodosInfo> {
      try {
        const { todos, projectName } = rawBatch;

        const todosToSave = transformTodos(projectName, todos);

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

    async compareLatestBatches(
      userId: string,
      projectName: string,
      limit: number = 2
    ): Promise<ComparisonResult> {
      try {
        const batches = await TodoModel.findByUserIdAndProject(
          userId,
          projectName
        );

        const sortedBatches = batches.sort(
          (a, b) =>
            new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
        );

        if (!sortedBatches || sortedBatches.length < limit) {
          return { missing: [], new: [], persisted: [] };
        }

        const latestBatch = sortedBatches[0];
        const prevBatch = sortedBatches[1];

        const latestIds = new Set(latestBatch.todos.map(t => t.id));
        const prevIds = new Set(prevBatch.todos.map(t => t.id));

        const missing = prevBatch.todos.filter(t => !latestIds.has(t.id));

        const newTodos = latestBatch.todos.filter(t => !prevIds.has(t.id));

        const persisted = latestBatch.todos.filter(t => prevIds.has(t.id));
        return {
          missing,
          new: newTodos,
          persisted,
        };
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to compare latest batches');
      }
    },

    async createResolution(
      userId: string,
      partialResolution: CreateResolutionRequest
    ): Promise<TodoResolution> {
      try {
        const resolution = await createResolutionToSave(
          userId,
          partialResolution
        );
        return await TodoModel.createResolution(resolution);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to create resolution');
      }
    },

    async findPendingResolutionsByUserId(
      userId: string
    ): Promise<TodoResolution[]> {
      try {
        return await TodoModel.findPendingResolutionsByUserId(userId);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve pending resolutions');
      }
    },
  };
};
