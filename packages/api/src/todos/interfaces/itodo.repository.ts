import { ProjectNames, TodoBatch, TodoResolution } from '@dev-dashboard/shared';

export interface ITodoRepository {
  create(batch: TodoBatch): Promise<TodoBatch>;
  findByUserId(userId: string): Promise<TodoBatch[]>;
  findByUserIdAndSyncId(
    userId: string,
    syncId: string
  ): Promise<TodoBatch | null>;
  findLatestByUserId(userId: string): Promise<TodoBatch | null>;
  findRecentByUserId(userId: string, limit?: number): Promise<TodoBatch[]>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodoBatch[]>;

  findProjectsByUserId(userId: string): Promise<ProjectNames>;

  findPendingResolutionsByUserId(userId: string): Promise<TodoResolution[]>;
  createResolutions(resolutions: TodoResolution[]): Promise<TodoResolution[]>;
  getResolved(userId: string): Promise<TodoResolution[]>;

  createCurrent(items: TodoResolution[]): Promise<TodoResolution[]>;
  deleteResolvedCurrent(): Promise<TodoResolution[]>;
}
