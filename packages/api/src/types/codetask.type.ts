export enum CodeTaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export type CodeTaskStatus = 'todo' | 'in-progress' | 'done';

export type PredefinedCodeTaskType =
  | 'TODO'
  | 'FIXME'
  | 'HACK'
  | 'NOTE'
  | 'BUG'
  | 'XXX';

export interface CodeTaskBase {
  id: string;
  userId: string;
  content: string;
  filePath: string;
  lineNumber: number;
  priority: CodeTaskPriority;
  status: CodeTaskStatus;
  syncedAt: string;
}

export interface PredefinedCodeTask extends CodeTaskBase {
  type: PredefinedCodeTaskType;
  customTag?: never;
}

export interface OtherCodeTask extends CodeTaskBase {
  type: 'OTHER';
  customTag: string;
}

export type CodeTask = PredefinedCodeTask | OtherCodeTask;

interface Meta {
  totalCount: number;
  lastScanAt: string;
  scannedFiles: number;
}

export interface CodeTasksInfo {
  userId: string;
  data: CodeTask[];
  meta: Meta;
}
