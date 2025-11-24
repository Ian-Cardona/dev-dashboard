import { uuidSchema } from '../utils/common';
import { VALIDATION_CONSTANTS } from '../utils/constants';
import z from 'zod';

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

export const todoIdSchema = z.union([
  uuidSchema,
  z.string().regex(/^[0-9a-f]{64}$/i),
]);

const todoCommonSchema = z.object({
  id: todoIdSchema,
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
  userId: uuidSchema,
  syncId: uuidSchema,
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
  userId: uuidSchema,
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
  id: todoIdSchema,
  type: z.string(),
  content: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
  syncedAt: z.string(),
  projectName: z.string(),
  userId: z.string(),
  syncId: z.string(),
});

export const createResolutionSchema = z.object({
  id: todoIdSchema,
  syncId: uuidSchema,
  reason: TodoReasonEnum,
});

const todoResolutionCommonSchema = z.object({
  userId: uuidSchema,
  resolved: z.boolean().default(false).optional(),
  resolvedAt: z.iso.datetime().optional(),
  reason: TodoReasonEnum.optional(),
});

export const todoResolutionSchema = todoSchema
  .and(todoResolutionCommonSchema)
  .and(
    z.object({
      syncId: todoBatchSchema.shape.syncId,
      createdAt: z.iso.datetime().optional(),
    })
  );

export const todosInfoWithResolvedSchema = todosInfoSchema.extend({
  resolvedTodos: z.array(todoResolutionSchema),
});
