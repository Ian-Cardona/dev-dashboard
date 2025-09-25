import { makeRelativePath } from '../../utils/path-manager';
import { RawTodo } from '@dev-dashboard/shared';

export const makeRelativePathTodo = (
  todo: RawTodo,
  pivotRoot: string
): RawTodo => ({
  ...todo,
  filePath: makeRelativePath(todo.filePath, pivotRoot),
});
