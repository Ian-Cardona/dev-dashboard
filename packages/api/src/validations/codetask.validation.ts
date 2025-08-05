import { z } from 'zod';
import { CodeTaskPriority } from '../types/codetask.type';
import { VALIDATION_CONSTANTS } from '../constants/validations';

// For existing
const codeTaskBaseFields = {
  id: z.uuidv4(),
  userId: z.uuidv4(),
  content: z
    .string()
    .min(VALIDATION_CONSTANTS.CODETASK.CONTENT.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CONTENT.MAX_LENGTH),
  filePath: z
    .string()
    .max(VALIDATION_CONSTANTS.CODETASK.FILE_PATH.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.FILE_PATH.PATTERN),
  lineNumber: z
    .number()
    .min(VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MIN)
    .max(VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MAX),
  syncedAt: z.iso.datetime(),
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
    .min(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.PATTERN),
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
  userId: z.uuidv4(),
  content: z
    .string()
    .min(VALIDATION_CONSTANTS.CODETASK.CONTENT.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CONTENT.MAX_LENGTH),
  filePath: z
    .string()
    .max(VALIDATION_CONSTANTS.CODETASK.FILE_PATH.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.FILE_PATH.PATTERN),
  lineNumber: z
    .number()
    .min(VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MIN)
    .max(VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MAX),
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
    .min(VALIDATION_CONSTANTS.CODETASK.CONTENT.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CONTENT.MAX_LENGTH),
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
    .min(VALIDATION_CONSTANTS.CODETASK.META.MIN_COUNT)
    .max(VALIDATION_CONSTANTS.CODETASK.META.MAX_COUNT),
  lastScanAt: z.iso.datetime(),
  scannedFiles: z
    .number()
    .min(VALIDATION_CONSTANTS.CODETASK.META.MIN_COUNT)
    .max(VALIDATION_CONSTANTS.CODETASK.META.MAX_COUNT),
});

export const codeTasksResponseValidation = z.object({
  userId: z.uuidv4(),
  data: z.array(codeTaskValidation),
  meta: metaValidation,
});
