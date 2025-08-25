import z from 'zod';
import {
  metaSchema,
  OtherTodoTypeEnum,
  PredefinedTodoTypeEnum,
  rawTodoBaseSchema,
  todoCreateSchema,
  TodoPriorityEnum,
  todoSchema,
  todosInfoSchema,
  TodoStatusEnum,
  updateTodoSchema,
} from '../schemas/todo.schema';

export type TodoPriority = z.infer<typeof TodoPriorityEnum>;
export type TodoStatus = z.infer<typeof TodoStatusEnum>;
export type PredefinedTodoType = z.infer<typeof PredefinedTodoTypeEnum>;
export type OtherTodoType = z.infer<typeof OtherTodoTypeEnum>;

export type RawTodo = z.infer<typeof rawTodoBaseSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodo = z.infer<typeof todoCreateSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export type Meta = z.infer<typeof metaSchema>;
export type TodosInfo = z.infer<typeof todosInfoSchema>;
