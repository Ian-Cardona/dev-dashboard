import {
  PredefinedTodoTypeEnum,
  PredefinedTodoTypeEnumType,
  ProcessedTodo,
  RawTodo,
} from '@dev-dashboard/shared';

export const tagTodos = (todos: RawTodo[]): ProcessedTodo[] => {
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
