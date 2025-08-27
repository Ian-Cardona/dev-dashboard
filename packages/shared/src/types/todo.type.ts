import z from 'zod';
import {
  createTodoSchema,
  todoMetaSchema,
  OtherTodoTypeEnum,
  PredefinedTodoTypeEnum,
  rawTodoSchema,
  TodoPriorityEnum,
  todoSchema,
  todosInfoSchema,
  TodoStatusEnum,
  updateTodoSchema,
} from '../schemas/todo.schema';

export type TodoPriorityEnumType = z.infer<typeof TodoPriorityEnum>;
export type TodoStatusEnumType = z.infer<typeof TodoStatusEnum>;
export type PredefinedTodoTypeEnumType = z.infer<typeof PredefinedTodoTypeEnum>;
export type OtherTodoTypeEnumType = z.infer<typeof OtherTodoTypeEnum>;

export type RawTodo = z.infer<typeof rawTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export type TodoMeta = z.infer<typeof todoMetaSchema>;
export type TodosInfo = z.infer<typeof todosInfoSchema>;
