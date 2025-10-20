import { generateUUID } from '../utils/uuid.utils';
import { ITodoRepository } from './interfaces/itodo.repository';
import { ComparisonResult, ITodoService } from './interfaces/itodo.service';
import {
  CreateResolution,
  ProjectNames,
  RawTodo,
  RawTodoBatch,
  Todo,
  TodoBatch,
  TodoMeta,
  TodoResolution,
  TodosInfo,
} from '@dev-dashboard/shared';
import crypto from 'crypto';

const buildTodosInfoResponse = (
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

const generateDeterministicTodoId = (
  projectName: string,
  todo: RawTodo
): string => {
  const normalizedContent = todo.content
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const base = `${projectName}|${todo.filePath}|${normalizedContent}`;
  return crypto.createHash('sha256').update(base).digest('hex');
};

const transformRawToBatchReady = (
  projectName: string,
  todos: RawTodo[]
): Todo[] => {
  return todos.map(todo => ({
    id: generateDeterministicTodoId(projectName, todo),
    ...todo,
  }));
};

export const TodoService = (TodoModel: ITodoRepository): ITodoService => {
  return {
    async createBatch(
      userId: string,
      rawBatch: RawTodoBatch
    ): Promise<TodosInfo> {
      try {
        const { todos, projectName } = rawBatch;
        const todosToSave = transformRawToBatchReady(projectName, todos);
        const timestamp = new Date().toISOString();

        const batchToDb: TodoBatch = {
          userId,
          syncId: generateUUID(),
          syncedAt: timestamp,
          projectName,
          todos: todosToSave,
        };

        const batch = await TodoModel.create(batchToDb);

        const currentTodos: TodoResolution[] = todosToSave.map(todo => ({
          id: todo.id,
          type: todo.type,
          content: todo.content,
          filePath: todo.filePath,
          lineNumber: todo.lineNumber,
          userId,
          syncId: batchToDb.syncId,
          createdAt: timestamp,
          resolved: false,
        }));

        await TodoModel.createCurrent(currentTodos);

        return buildTodosInfoResponse(userId, [batch]);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },
    async getBatchesByUserId(userId: string): Promise<TodosInfo> {
      try {
        const batches = await TodoModel.findByUserId(userId);
        return buildTodosInfoResponse(userId, batches);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async getBatchByUserIdAndSyncId(
      userId: string,
      syncId: string
    ): Promise<TodosInfo> {
      try {
        const batch = await TodoModel.findByUserIdAndSyncId(userId, syncId);
        if (!batch) {
          return buildTodosInfoResponse(userId, []);
        }
        return buildTodosInfoResponse(userId, [batch]);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async getLatestBatchByUserId(userId: string): Promise<TodosInfo | null> {
      try {
        const batch = await TodoModel.findLatestByUserId(userId);
        if (!batch) return null;
        return buildTodosInfoResponse(userId, [batch]);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async getRecentBatchesByUserId(
      userId: string,
      limit: number = 10
    ): Promise<TodosInfo> {
      try {
        const batches = await TodoModel.findRecentByUserId(userId, limit);
        return buildTodosInfoResponse(userId, batches);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve tasks');
      }
    },

    async getProjectsByUserId(userId: string): Promise<ProjectNames> {
      try {
        return await TodoModel.findProjectsByUserId(userId);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve projects');
      }
    },

    async getBatchesByUserIdAndProject(
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
        return buildTodosInfoResponse(userId, batches);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to retrieve tasks by project');
      }
    },

    async compareLatestBatchesByProject(
      userId: string,
      projectName: string,
      limit: number = 2
    ): Promise<ComparisonResult> {
      try {
        const batches = await TodoModel.findByUserIdAndProject(
          userId,
          projectName,
          limit
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
          prevBatchSyncId: prevBatch.syncId,
          latestBatchSyncId: latestBatch.syncId,
        };
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to compare latest batches');
      }
    },

    async identifyMissingTodosAndCreateResolutions(
      userId: string,
      projectName: string,
      limit: number = 2
    ): Promise<TodoResolution[]> {
      try {
        const comparison = await this.compareLatestBatchesByProject(
          userId,
          projectName,
          limit
        );

        if (!comparison.missing?.length || !comparison.prevBatchSyncId) {
          return [];
        }

        const existingPending =
          await this.getPendingResolutionsByUserId(userId);
        const existingIds = new Set(existingPending.map(r => r.id));

        const newMissingTodos = comparison.missing.filter(
          todo => !existingIds.has(todo.id)
        );

        if (!newMissingTodos.length) {
          return [];
        }

        const resolutions: TodoResolution[] = newMissingTodos.map(todo => {
          if (!todo.id || !todo.content || !todo.filePath) {
            throw new Error(
              `Invalid todo data: missing required fields for todo ${todo.id}`
            );
          }

          return {
            ...todo,
            userId,
            syncId: comparison.prevBatchSyncId!,
            createdAt: new Date().toISOString(),
            resolved: false,
          };
        });

        return await TodoModel.createResolutions(resolutions);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error(
          'Failed to identify missing todos and create resolutions'
        );
      }
    },

    async updateResolutionsAsResolved(
      userId: string,
      resolveRequests: CreateResolution[]
    ): Promise<TodoResolution[]> {
      try {
        const pendingResolutions =
          await this.getPendingResolutionsByUserId(userId);
        const pendingMap = new Map(
          pendingResolutions.filter(r => !r.resolved).map(r => [r.id, r])
        );

        console.log('pendingResolutions', JSON.stringify(pendingResolutions));
        console.log('resolveRequests', JSON.stringify(resolveRequests));

        const resolvedResolutions: TodoResolution[] = [];
        const resolvedAt = new Date().toISOString();

        for (const resolveRequest of resolveRequests) {
          const targetResolution = pendingMap.get(resolveRequest.id);

          if (!targetResolution) {
            continue;
          }

          const resolvedResolution: TodoResolution = {
            ...targetResolution,
            resolved: true,
            resolvedAt,
            reason: resolveRequest.reason,
          };

          resolvedResolutions.push(resolvedResolution);
        }

        const updatedResolutions =
          await TodoModel.createResolutions(resolvedResolutions);

        await TodoModel.createCurrent(resolvedResolutions);

        return updatedResolutions;
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to resolve missing todo');
      }
    },

    async getPendingResolutionsByUserId(
      userId: string
    ): Promise<TodoResolution[]> {
      try {
        const resolutions =
          await TodoModel.findPendingResolutionsByUserId(userId);
        return resolutions;
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve pending resolutions');
      }
    },

    getResolved(userId: string): Promise<TodoResolution[]> {
      try {
        return TodoModel.getResolved(userId);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve resolved todos');
      }
    },

    async deleteResolvedCurrent(): Promise<void> {
      try {
        await TodoModel.deleteResolvedCurrent();
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to delete resolved todos');
      }
    },
  };
};
