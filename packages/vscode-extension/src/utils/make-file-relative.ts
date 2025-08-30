import * as path from 'path';

export const makeRelativePath = (
  absolutePath: string,
  rootPath: string
): string => path.relative(rootPath, absolutePath);
