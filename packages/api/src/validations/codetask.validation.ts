import { z } from 'zod';
import { CodeTaskPriority } from '../types/codetask.type';

const codeTaskBaseFields = {
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
  syncedAt: z.string(),
  priority: z.enum(CodeTaskPriority),
  status: z.enum(['todo', 'in-progress', 'done']),
};

const predefinedCodeTaskFields = z.object({
  type: z.enum(['TODO', 'FIXME', 'HACK', 'NOTE', 'BUG', 'XXX']),
  customTag: z.undefined().optional(),
});

const predefinedCodeTaskSchema = z.object({
  ...codeTaskBaseFields,
  ...predefinedCodeTaskFields.shape,
});

const otherCodeTaskFields = z.object({
  type: z.literal('OTHER'),
  customTag: z.string(),
});

const otherCodeTaskSchema = z.object({
  ...codeTaskBaseFields,
  ...otherCodeTaskFields.shape,
});

export const codeTaskValidation = z.discriminatedUnion('type', [
  predefinedCodeTaskSchema,
  otherCodeTaskSchema,
]);

const updatableFields = {
  content: z.string(),
  priority: z.enum(CodeTaskPriority),
  status: z.enum(['todo', 'in-progress', 'done']),
};

const predefinedUpdateSchema = z.object({
  ...updatableFields,
  ...predefinedCodeTaskFields.shape,
});

const otherUpdateSchema = z.object({
  ...updatableFields,
  ...otherCodeTaskFields.shape,
});

export const codeTaskUpdateValidation = z.discriminatedUnion('type', [
  predefinedUpdateSchema,
  otherUpdateSchema,
]);

export const metaValidation = z.object({
  totalCount: z.number(),
  lastScanAt: z.string(),
  scannedFiles: z.number(),
});

export const codeTasksResponseValidation = z.object({
  userId: z.string(),
  data: z.array(codeTaskValidation),
  meta: metaValidation,
});
