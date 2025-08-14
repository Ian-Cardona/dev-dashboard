import z from 'zod';
import {
  codeTaskCreateValidation,
  CodeTaskPriorityEnum,
  codeTasksInfoValidationSchema,
  CodeTaskStatusEnum,
  codeTaskValidationSchema,
  metaValidationSchema,
  PredefinedCodeTaskTypeEnum,
  OtherCodeTaskTypeEnum,
  updateCodeTaskValidation,
} from '../schema/codetask.schema';

// Types
export type CodeTaskPriority = z.infer<typeof CodeTaskPriorityEnum>;
export type CodeTaskStatus = z.infer<typeof CodeTaskStatusEnum>;
export type PredefinedCodeTaskType = z.infer<typeof PredefinedCodeTaskTypeEnum>;
export type OtherCodeTaskType = z.infer<typeof OtherCodeTaskTypeEnum>;

export type CodeTask = z.infer<typeof codeTaskValidationSchema>;
export type CreateCodeTask = z.infer<typeof codeTaskCreateValidation>;
export type UpdateCodeTask = z.infer<typeof updateCodeTaskValidation>;

export type Meta = z.infer<typeof metaValidationSchema>;
export type CodeTasksInfo = z.infer<typeof codeTasksInfoValidationSchema>;

// export enum CodeTaskPriority {
//   LOW = 'low',
//   MEDIUM = 'medium',
//   HIGH = 'high',
//   CRITICAL = 'critical',
// }

// export type CodeTaskStatus = 'todo' | 'in-progress' | 'done';

// export type PredefinedCodeTaskType =
//   | 'TODO'
//   | 'FIXME'
//   | 'HACK'
//   | 'NOTE'
//   | 'BUG'
//   | 'XXX';

// export interface CodeTaskBase {
//   id: string;
//   userId: string;
//   content: string;
//   filePath: string;
//   lineNumber: number;
//   priority: CodeTaskPriority;
//   status: CodeTaskStatus;
//   syncedAt: string;
// }

// export interface PredefinedCodeTask extends CodeTaskBase {
//   type: PredefinedCodeTaskType;
//   customTag?: never;
// }

// export interface OtherCodeTask extends CodeTaskBase {
//   type: 'OTHER';
//   customTag: string;
// }

// export type CodeTask = PredefinedCodeTask | OtherCodeTask;

// export interface Meta {
//   totalCount: number;
//   lastScanAt: string;
//   scannedFiles: number;
// }

// export interface CodeTasksInfo {
//   userId: string;
//   data: CodeTask[];
//   meta: Meta;
// }
