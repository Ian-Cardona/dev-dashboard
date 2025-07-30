import { CodeTaskModel } from '../models/codetask.model';
import { CodeTask, CodeTasksInfo } from '../types/codetask.type';

export const CodeTaskService = {
  async create(data: CodeTask): Promise<CodeTask> {
    return CodeTaskModel.create(data);
  },

  async findByUserId(userId: string): Promise<CodeTasksInfo> {
    const data = await CodeTaskModel.findByUserId(userId);
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
    await CodeTaskModel.update(id, userId, updates);
  },

  async delete(id: string, userId: string): Promise<void> {
    await CodeTaskModel.delete(id, userId);
  },
};
