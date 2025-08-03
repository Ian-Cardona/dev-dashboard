import { z } from 'zod';
import { CodeTaskPriority } from '../types/codetask.type';
import { CODETASK_VALIDATION } from '../constants/validations';

// For existing
const codeTaskBaseFields = {
  id: z.string().pipe(z.uuid()),
  userId: z.string().pipe(z.uuid()),
  content: z
    .string()
    .min(CODETASK_VALIDATION.CONTENT.MIN_LENGTH)
    .max(CODETASK_VALIDATION.CONTENT.MAX_LENGTH),
  filePath: z
    .string()
    .max(CODETASK_VALIDATION.FILE_PATH.MAX_LENGTH)
    .regex(CODETASK_VALIDATION.FILE_PATH.PATTERN),
  lineNumber: z
    .number()
    .min(CODETASK_VALIDATION.LINE_NUMBER.MIN)
    .max(CODETASK_VALIDATION.LINE_NUMBER.MAX),
  syncedAt: z.string().regex(CODETASK_VALIDATION.SYNCED_AT.PATTERN),
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
  customTag: z
    .string()
    .min(CODETASK_VALIDATION.CUSTOM_TAG.MIN_LENGTH)
    .max(CODETASK_VALIDATION.CUSTOM_TAG.MAX_LENGTH)
    .regex(CODETASK_VALIDATION.CUSTOM_TAG.PATTERN),
});

const otherCodeTaskSchema = z.object({
  ...codeTaskBaseFields,
  ...otherCodeTaskFields.shape,
});

export const codeTaskValidation = z.discriminatedUnion('type', [
  predefinedCodeTaskSchema,
  otherCodeTaskSchema,
]);

// For Creation
const creatableFields = {
  userId: z.string().pipe(z.uuid()),
  content: z
    .string()
    .min(CODETASK_VALIDATION.CONTENT.MIN_LENGTH)
    .max(CODETASK_VALIDATION.CONTENT.MAX_LENGTH),
  filePath: z
    .string()
    .max(CODETASK_VALIDATION.FILE_PATH.MAX_LENGTH)
    .regex(CODETASK_VALIDATION.FILE_PATH.PATTERN),
  lineNumber: z
    .number()
    .min(CODETASK_VALIDATION.LINE_NUMBER.MIN)
    .max(CODETASK_VALIDATION.LINE_NUMBER.MAX),
  priority: z.enum(CodeTaskPriority),
  status: z.enum(['todo', 'in-progress', 'done']),
};

const predefinedCreateSchema = z.object({
  ...creatableFields,
  ...predefinedCodeTaskFields.shape,
});

const otherCreateSchema = z.object({
  ...creatableFields,
  ...otherCodeTaskFields.shape,
});

export const codeTaskCreateValidation = z.discriminatedUnion('type', [
  predefinedCreateSchema,
  otherCreateSchema,
]);

// For Updating
const updatableFields = {
  content: z
    .string()
    .min(CODETASK_VALIDATION.CONTENT.MIN_LENGTH)
    .max(CODETASK_VALIDATION.CONTENT.MAX_LENGTH),
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
  totalCount: z
    .number()
    .min(CODETASK_VALIDATION.META.MIN_COUNT)
    .max(CODETASK_VALIDATION.META.MAX_COUNT),
  lastScanAt: z.string(),
  scannedFiles: z
    .number()
    .min(CODETASK_VALIDATION.META.MIN_COUNT)
    .max(CODETASK_VALIDATION.META.MAX_COUNT),
});

export const codeTasksResponseValidation = z.object({
  userId: z.string().pipe(z.uuid()),
  data: z.array(codeTaskValidation),
  meta: metaValidation,
});
