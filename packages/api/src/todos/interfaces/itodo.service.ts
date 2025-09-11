import {
  CreateResolution,
  ProjectNames,
  RawTodoBatch,
  Todo,
  TodoResolution,
  TodosInfo,
} from '@dev-dashboard/shared';

export type ComparisonResult = {
  missing: Todo[];
  new: Todo[];
  persisted: Todo[];
  prevBatchSyncId?: string;
  latestBatchSyncId?: string;
};

export interface ITodoService {
  createBatch(userId: string, batch: RawTodoBatch): Promise<TodosInfo>;
  getBatchesByUserId(userId: string): Promise<TodosInfo>;
  getBatchByUserIdAndSyncId(userId: string, syncId: string): Promise<TodosInfo>;
  getLatestBatchByUserId(userId: string): Promise<TodosInfo | null>;
  getRecentBatchesByUserId(userId: string, limit?: number): Promise<TodosInfo>;
  getProjectsByUserId(userId: string): Promise<ProjectNames>;
  getBatchesByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodosInfo>;
  compareLatestBatchesByProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<ComparisonResult>;
  identifyMissingTodosAndCreateResolutions(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodoResolution[]>;
  getPendingResolutionsByUserId(userId: string): Promise<TodoResolution[]>;
  updateResolutionsAsResolved(
    userId: string,
    resolveRequests: CreateResolution[]
  ): Promise<TodoResolution[]>;
  deleteResolvedCurrent(): Promise<void>;
}
