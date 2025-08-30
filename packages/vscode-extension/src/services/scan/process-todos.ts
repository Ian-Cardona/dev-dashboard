import {
  PredefinedTodoTypeEnum,
  PredefinedTodoTypeEnumType,
  ProcessedTodos,
  RawTodo,
} from '@dev-dashboard/shared';

export const processTodos = (todos: RawTodo[]): ProcessedTodos[] => {
  return todos.map(todo => {
    const isPredefined = PredefinedTodoTypeEnum.safeParse(todo.type).success;

    if (isPredefined) {
      return {
        ...todo,
        type: todo.type as PredefinedTodoTypeEnumType,
        customTag: undefined,
      };
    } else {
      return {
        ...todo,
        type: 'OTHER',
        customTag: todo.type,
      };
    }
  });
};
