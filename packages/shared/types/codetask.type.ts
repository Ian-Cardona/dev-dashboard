import z from 'zod';
import {
  codeTaskCreateSchema,
  CodeTaskPriorityEnum,
  codeTasksInfoSchema,
  CodeTaskStatusEnum,
  codeTaskSchema,
  metaSchema,
  PredefinedCodeTaskTypeEnum,
  OtherCodeTaskTypeEnum,
  updateCodeTaskSchema,
} from '../schemas/codetask.schema';

// Types
export type CodeTaskPriority = z.infer<typeof CodeTaskPriorityEnum>;
export type CodeTaskStatus = z.infer<typeof CodeTaskStatusEnum>;
export type PredefinedCodeTaskType = z.infer<typeof PredefinedCodeTaskTypeEnum>;
export type OtherCodeTaskType = z.infer<typeof OtherCodeTaskTypeEnum>;

export type CodeTask = z.infer<typeof codeTaskSchema>;
export type CreateCodeTask = z.infer<typeof codeTaskCreateSchema>;
export type UpdateCodeTask = z.infer<typeof updateCodeTaskSchema>;

export type Meta = z.infer<typeof metaSchema>;
export type CodeTasksInfo = z.infer<typeof codeTasksInfoSchema>;
