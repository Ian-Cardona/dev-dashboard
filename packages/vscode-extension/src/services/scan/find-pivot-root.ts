import { findGitRoot } from '../../utils/repository-manager';

export const findPivotRoot = (
  workspacePath: string
): {
  pivotRoot: string;
  // pivotType: 'git' | 'workspace';
} => {
  const gitRoot = findGitRoot(workspacePath);

  if (gitRoot) {
    return {
      pivotRoot: gitRoot,
      // pivotType: 'git',
    };
  }

  return {
    pivotRoot: workspacePath,
    // pivotType: 'workspace',
  };
};
