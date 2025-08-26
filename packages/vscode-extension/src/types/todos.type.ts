import z from 'zod';

export const PredefinedTodoTypeEnum = z.enum([
  'TODO',
  'FIXME',
  'HACK',
  'NOTE',
  'BUG',
  'XXX',
]);

export const OtherTodoTypeEnum = z.literal('OTHER');

const rawUndefinedTodoBaseSchema = z.object({
  type: z.string(),
  content: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
});

const rawPredefinedTodoSchema = rawUndefinedTodoBaseSchema.extend({
  type: PredefinedTodoTypeEnum,
  customTag: z.undefined().optional(),
});

const rawOtherTodoSchema = rawUndefinedTodoBaseSchema.extend({
  type: z.literal('OTHER'),
  customTag: z.string(),
});

export const rawTodoSchema = z.discriminatedUnion('type', [
  rawPredefinedTodoSchema,
  rawOtherTodoSchema,
]);

export type PredefinedTodoTypeEnum = z.infer<typeof PredefinedTodoTypeEnum>;
export type OtherTodoTypeEnum = z.infer<typeof OtherTodoTypeEnum>;

export type RawUndefinedTodoBaseSchema = z.infer<
  typeof rawUndefinedTodoBaseSchema
>;
export type RawTodo = z.infer<typeof rawTodoSchema>;
