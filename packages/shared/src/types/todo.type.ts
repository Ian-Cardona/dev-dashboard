import {
  OtherTodoTypeEnum,
  PredefinedTodoTypeEnum,
  TodoReasonEnum,
  createResolutionSchema,
  flattenedTodosInfoSchema,
  processedTodoSchema,
  projectNamesSchema,
  rawTodoBaseSchema,
  rawTodoBatchSchema,
  todoBatchSchema,
  todoMetaSchema,
  todoResolutionSchema,
  todoSchema,
  todosInfoSchema,
  todoHistorySchema,
} from '../schemas/todo.schema';
import z from 'zod';

export type TodoReasonEnumType = z.infer<typeof TodoReasonEnum>;
export type PredefinedTodoTypeEnumType = z.infer<typeof PredefinedTodoTypeEnum>;
export type OtherTodoTypeEnumType = z.infer<typeof OtherTodoTypeEnum>;

export type RawTodo = z.infer<typeof rawTodoBaseSchema>;
export type ProcessedTodo = z.infer<typeof processedTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;

export type RawTodoBatch = z.infer<typeof rawTodoBatchSchema>;
export type TodoBatch = z.infer<typeof todoBatchSchema>;

export type TodoMeta = z.infer<typeof todoMetaSchema>;
export type TodosInfo = z.infer<typeof todosInfoSchema>;
export type TodoHistory = z.infer<typeof todoHistorySchema>;

export type ProjectNames = z.infer<typeof projectNamesSchema>;
export type FlattenedTodo = z.infer<typeof flattenedTodosInfoSchema>;

// Resolution Related
export type TodoResolution = z.infer<typeof todoResolutionSchema>;
export type CreateResolution = z.infer<typeof createResolutionSchema>;
