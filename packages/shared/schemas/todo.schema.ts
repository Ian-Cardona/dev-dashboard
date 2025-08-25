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

// TODO: Create a more robust data model for the TODO Item from the VSCode extension to the API
export const rawTodoBaseSchema = z.object({
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

const todoBaseSchema = rawTodoBaseSchema.extend({
  userId: z.uuidv4(),
  id: z.uuidv4(),
  syncedAt: z.iso.datetime({ offset: true }),
  // priority: TodoPriorityEnum,
  // status: TodoStatusEnum,
});

const predefinedTodoSchema = todoBaseSchema.extend({
  type: PredefinedTodoTypeEnum,
  customTag: z.undefined().optional(),
});

const otherTodoSchema = todoBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.PATTERN),
});

export const todoSchema = z.discriminatedUnion('type', [
  predefinedTodoSchema,
  otherTodoSchema,
]);

// Creation
const createTodoSchema = todoBaseSchema.omit({ id: true, syncedAt: true });

const predefinedCreateSchema = createTodoSchema.extend({
  type: PredefinedTodoTypeEnum,
  customTag: z.undefined().optional(),
});

const otherCreateSchema = createTodoSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.PATTERN),
});

export const todoCreateSchema = z.discriminatedUnion('type', [
  predefinedCreateSchema,
  otherCreateSchema,
]);

// Update
const updateTodoBaseSchema = todoBaseSchema.pick({
  filePath: true,
  lineNumber: true,
  content: true,
});

const predefinedTodoUpdateSchema = updateTodoBaseSchema.extend({
  type: PredefinedTodoTypeEnum,
  customTag: z.undefined().optional(),
});

const otherTodoUpdateSchema = updateTodoBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z
    .string()
    .min(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.MAX_LENGTH)
    .regex(VALIDATION_CONSTANTS.TODO.CUSTOM_TAG.PATTERN),
});

export const updateTodoSchema = z.discriminatedUnion('type', [
  predefinedTodoUpdateSchema,
  otherTodoUpdateSchema,
]);

// Metadata
export const metaSchema = z.object({
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
  data: z.array(todoSchema),
  meta: metaSchema,
});
