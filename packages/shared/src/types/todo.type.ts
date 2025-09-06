import z from 'zod';
import {
  todoMetaSchema,
  OtherTodoTypeEnum,
  PredefinedTodoTypeEnum,
  processedTodoSchema,
  TodoReasonEnum,
  todoSchema,
  todosInfoSchema,
  rawTodoBaseSchema,
  projectNamesSchema,
  todoBatchSchema,
  rawTodoBatchSchema,
  flattenedTodosInfoSchema,
} from '../schemas/todo.schema';

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
export type FlattenedTodo = z.infer<typeof flattenedTodosInfoSchema>;

export type ProjectNames = z.infer<typeof projectNamesSchema>;
