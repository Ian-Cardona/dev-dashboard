import { findGitRoot } from '../../utils/repository-manager';
import path from 'path';

export const findPivotRoot = (
  workspacePath: string
): {
  pivotRoot: string;
  projectName: string;
} => {
  const gitRoot = findGitRoot(workspacePath);

  if (gitRoot) {
    return {
      pivotRoot: gitRoot,
      projectName: path.basename(gitRoot),
    };
  }

  return {
    pivotRoot: workspacePath,
    projectName: path.basename(workspacePath),
  };
};
