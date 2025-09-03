import path from 'path';
import { findGitRoot } from '../../utils/repository-manager';

export const findPivotRoot = (
  workspacePath: string
): {
  pivotRoot: string;
  projectName: string;
  // pivotType: 'git' | 'workspace';
} => {
  const gitRoot = findGitRoot(workspacePath);

  if (gitRoot) {
    return {
      pivotRoot: gitRoot,
      projectName: path.basename(gitRoot),
      // pivotType: 'git',
    };
  }

  return {
    pivotRoot: workspacePath,
    projectName: path.basename(workspacePath),
    // pivotType: 'workspace',
  };
};
