import z from 'zod';
import {
  todoMetaSchema,
  OtherTodoTypeEnum,
  PredefinedTodoTypeEnum,
  processedTodosSchema,
  TodoPriorityEnum,
  todoSchema,
  todosInfoSchema,
  TodoStatusEnum,
  rawTodoBaseSchema,
  projectNamesSchema,
  todoBatchSchema,
  rawTodoBatchSchema,
} from '../schemas/todo.schema';

export type TodoPriorityEnumType = z.infer<typeof TodoPriorityEnum>;
export type TodoStatusEnumType = z.infer<typeof TodoStatusEnum>;
export type PredefinedTodoTypeEnumType = z.infer<typeof PredefinedTodoTypeEnum>;
export type OtherTodoTypeEnumType = z.infer<typeof OtherTodoTypeEnum>;

export type RawTodo = z.infer<typeof rawTodoBaseSchema>;
export type ProcessedTodos = z.infer<typeof processedTodosSchema>;
export type Todo = z.infer<typeof todoSchema>;

export type RawTodoBatch = z.infer<typeof rawTodoBatchSchema>;
export type TodoBatch = z.infer<typeof todoBatchSchema>;

export type TodoMeta = z.infer<typeof todoMetaSchema>;
export type TodosInfo = z.infer<typeof todosInfoSchema>;

export type ProjectNames = z.infer<typeof projectNamesSchema>;
