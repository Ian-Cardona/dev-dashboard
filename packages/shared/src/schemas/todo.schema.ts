import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

export const TodoPriorityEnum = z.enum(['low', 'medium', 'high', 'critical']);
export const TodoStatusEnum = z.enum(['todo', 'in-progress', 'done']);
export const PredefinedTodoTypeEnum = z.enum([
  'TODO',
  'FIXME',
  'HACK',
  'NOTE',
  'BUG',
  'XXX',
]);

export const OtherTodoTypeEnum = z.literal('OTHER');

export const rawTodoBaseSchema = z.object({
  type: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CONTENT.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CONTENT.MAX_LENGTH),
  content: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CONTENT.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CONTENT.MAX_LENGTH),
  filePath: z
    .string()
    .max(VALIDATION_CONSTANTS.TODO.FILE_PATH.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.TODO.FILE_PATH.PATTERN),
  lineNumber: z
    .number()
    .min(VALIDATION_CONSTANTS.TODO.LINE_NUMBER.MIN)
    .max(VALIDATION_CONSTANTS.TODO.LINE_NUMBER.MAX),
});

const unprocessedPredefinedTodoSchema = rawTodoBaseSchema.extend({
  type: PredefinedTodoTypeEnum,
  customTag: z.undefined().optional(),
});

const unprocessedOtherTodoSchema = rawTodoBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.PATTERN),
});

export const processedTodosSchema = z.discriminatedUnion('type', [
  unprocessedPredefinedTodoSchema,
  unprocessedOtherTodoSchema,
]);

const todoCommonSchema = z.object({
  id: z.uuidv4(),
  resolved: z.boolean().default(false),
});

export const rawTodoBatchSchema = z.object({
  userId: z.uuidv4(),
  projectName: z
    .string()
    .min(1)
    .max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH),
  todos: z.array(rawTodoBaseSchema),
});

export const todoSchema = rawTodoBaseSchema.and(todoCommonSchema);

export const todoBatchSchema = z.object({
  userId: z.uuidv4(),
  syncId: z.uuidv4(),
  syncedAt: z.iso.datetime({ offset: true }),
  projectName: z
    .string()
    .min(1)
    .max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH),
  todos: z.array(todoSchema),
});

// Metadata
export const todoMetaSchema = z.object({
  userId: z.uuidv4(),
  totalCount: z
    .number()
    .min(VALIDATION_CONSTANTS.TODO.META.MIN_COUNT)
    .max(VALIDATION_CONSTANTS.TODO.META.MAX_COUNT),
  lastScanAt: z.iso.datetime(),
  scannedFiles: z
    .number()
    .min(VALIDATION_CONSTANTS.TODO.META.MIN_COUNT)
    .max(VALIDATION_CONSTANTS.TODO.META.MAX_COUNT),
});

// Full Information with Metadata
export const todosInfoSchema = z.object({
  userId: z.uuidv4(),
  todosBatch: todoBatchSchema,
  meta: todoMetaSchema,
});

export const projectNamesSchema = z.object({
  projects: z
    .array(
      z.string().min(1).max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH)
    )
    .max(155),
});
