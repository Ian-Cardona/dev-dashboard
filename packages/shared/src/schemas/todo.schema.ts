import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

export const TodoReasonEnum = z.enum([
  'done',
  'moved',
  'not_needed',
  'done_by_others',
  'blocked',
  'refactored',
  'moved_elsewhere',
  'duplicate',
  'obsolete',
  'invalid',
  'wont_fix',
  'out_of_scope',
  'implemented',
  'cannot_reproduce',
  'not_reproducible',
]);

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

export const processedTodoSchema = z.discriminatedUnion('type', [
  unprocessedPredefinedTodoSchema,
  unprocessedOtherTodoSchema,
]);

const todoCommonSchema = z.object({
  id: z.uuidv4(),
  resolved: z.boolean().default(false),
  reason: TodoReasonEnum.optional(),
});

export const rawTodoBatchSchema = z.object({
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
  todosBatches: z.array(todoBatchSchema),
  meta: todoMetaSchema,
});

export const projectNamesSchema = z.object({
  projects: z
    .array(
      z.string().min(1).max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH)
    )
    .max(155),
});

export const flattenedTodosInfoSchema = z.object({
  id: z.uuidv4(),
  type: z.string(),
  content: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
  resolved: z.boolean(),
  syncedAt: z.string(),
  projectName: z.string(),
  userId: z.string(),
  syncId: z.string(),
});
