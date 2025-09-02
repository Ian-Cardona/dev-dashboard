import { RawTodo } from '@dev-dashboard/shared';
import { makeRelativePath } from '../../utils/path-manager';

export const makeRelativePathTodo = (
  todo: RawTodo,
  pivotRoot: string
): RawTodo => ({
  ...todo,
  filePath: makeRelativePath(todo.filePath, pivotRoot),
});
