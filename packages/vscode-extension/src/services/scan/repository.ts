import { execSync } from 'child_process';
import { RawTodo } from '@dev-dashboard/shared';
import { makeRelativePath } from '../../utils/path-manager';

export const getRepositoryInfo = (gitRoot: string) => {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      cwd: gitRoot,
      encoding: 'utf8',
    }).trim();

    const repoName =
      remoteUrl.match(/\/([^\\/]+?)(?:\.git)?$/)?.[1] || 'unknown';
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: gitRoot,
      encoding: 'utf8',
    }).trim();

    return { remoteUrl, repoName, branch };
  } catch {
    return { remoteUrl: null, repoName: null, branch: null };
  }
};

export const findGitRoot = (startPath: string): string | null => {
  try {
    return execSync('git rev-parse --show-toplevel', {
      cwd: startPath,
      encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
};

export const makeRelativePathTodo = (
  todo: RawTodo,
  pivotRoot: string
): RawTodo => ({
  ...todo,
  filePath: makeRelativePath(todo.filePath, pivotRoot),
});

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
