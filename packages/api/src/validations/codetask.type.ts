import { z } from 'zod';

const codeTaskBase = {
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
  syncedAt: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['todo', 'in-progress', 'done']),
};

const predefinedCodeTaskSchema = z.object({
  ...codeTaskBase,
  type: z.enum(['TODO', 'FIXME', 'HACK', 'NOTE', 'BUG', 'XXX']),
  customTag: z.undefined().optional(),
});

const otherCodeTaskSchema = z.object({
  ...codeTaskBase,
  type: z.literal('OTHER'),
  customTag: z.string(),
});

export const codeTaskZodValidation = z.discriminatedUnion('type', [
  predefinedCodeTaskSchema,
  otherCodeTaskSchema,
]);

export const metaZodValidation = z.object({
  totalCount: z.number(),
  lastScanAt: z.string(),
  scannedFiles: z.number(),
});

export const codeTasksResponseZodValidation = z.object({
  userId: z.string(),
  data: z.array(codeTaskZodValidation),
  meta: metaZodValidation,
});
