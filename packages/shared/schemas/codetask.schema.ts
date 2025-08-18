import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

// TODO: Assess the use of these enums
export const CodeTaskPriorityEnum = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);
export const CodeTaskStatusEnum = z.enum(['todo', 'in-progress', 'done']);
export const PredefinedCodeTaskTypeEnum = z.enum([
  'TODO',
  'FIXME',
  'HACK',
  'NOTE',
  'BUG',
  'XXX',
]);
export const OtherCodeTaskTypeEnum = z.literal('OTHER');

// Base
const codeTaskBaseSchema = z.object({
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
  syncedAt: z.iso.datetime({ offset: true }),
  priority: CodeTaskPriorityEnum,
  status: CodeTaskStatusEnum,
});

// Variants
const predefinedCodeTaskSchema = codeTaskBaseSchema.extend({
  type: PredefinedCodeTaskTypeEnum,
  customTag: z.undefined().optional(),
});

const otherCodeTaskSchema = codeTaskBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.PATTERN),
});

// Main validation
export const codeTaskSchema = z.discriminatedUnion('type', [
  predefinedCodeTaskSchema,
  otherCodeTaskSchema,
]);

// Creation
const createCodeTaskSchema = codeTaskBaseSchema
  .omit({ id: true, syncedAt: true })
  .partial({ priority: true, status: true });

const predefinedCreateSchema = createCodeTaskSchema.extend({
  type: PredefinedCodeTaskTypeEnum,
  customTag: z.undefined().optional(),
});

const otherCreateSchema = createCodeTaskSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.PATTERN),
});

export const codeTaskCreateSchema = z.discriminatedUnion('type', [
  predefinedCreateSchema,
  otherCreateSchema,
]);

// Update
const updateCodeTaskBaseSchema = codeTaskBaseSchema.pick({
  filePath: true,
  lineNumber: true,
  content: true,
  priority: true,
  status: true,
});

const predefinedUpdateSchema = updateCodeTaskBaseSchema.extend({
  type: PredefinedCodeTaskTypeEnum,
  customTag: z.undefined().optional(),
});

const otherUpdateSchema = updateCodeTaskBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.PATTERN),
});

export const updateCodeTaskSchema = z.discriminatedUnion('type', [
  predefinedUpdateSchema,
  otherUpdateSchema,
]);

// Metadata
export const metaSchema = z.object({
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

// Full Information with Metadata
export const codeTasksInfoSchema = z.object({
  userId: z.uuidv4(),
  data: z.array(codeTaskSchema),
  meta: metaSchema,
});
