import { CodeTask, CodeTasksInfo } from '../types/codetask.type';
import { ICodeTaskModel } from '../models/codetask.model';

export interface ICodeTaskService {
  create(data: CodeTask): Promise<CodeTask>;
  findByUserId(userId: string): Promise<CodeTasksInfo>;
  update(id: string, userId: string, updates: Partial<CodeTask>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const CodeTaskService = (codeTaskModel: ICodeTaskModel) => {
  return {
    async create(data: CodeTask): Promise<CodeTask> {
      return codeTaskModel.create(data);
    },

    async findByUserId(userId: string): Promise<CodeTasksInfo> {
      const data = await codeTaskModel.findByUserId(userId);
      return {
        userId,
        data,
        meta: {
          totalCount: data.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles: 0, // TODO: Add actual scanned files count here
        },
      };
    },

    async update(
      id: string,
      userId: string,
      updates: Partial<CodeTask>
    ): Promise<void> {
      await codeTaskModel.update(id, userId, updates);
    },

    async delete(id: string, userId: string): Promise<void> {
      await codeTaskModel.delete(id, userId);
    },
  };
};
