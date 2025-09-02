import { execSync } from 'child_process';

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
