import { execSync } from 'child_process';
import * as vscode from 'vscode';

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

export const getGitProjectInfo = (startPath: string) => {
  const root = findGitRoot(startPath);
  if (!root) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const folder = workspaceFolders[0];
      return {
        id: Buffer.from(folder.uri.fsPath).toString('base64').slice(0, 8),
        name: folder.name,
        path: folder.uri.fsPath,
        remoteUrl: null,
      };
    }
    return null;
  }

  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      cwd: root,
      encoding: 'utf8',
    }).trim();

    const name = remoteUrl
      ? remoteUrl
          .split('/')
          .pop()
          ?.replace(/\.git$/, '')
      : root.split('/').pop();

    return {
      id: Buffer.from(root).toString('base64').slice(0, 8),
      name,
      path: root,
      remoteUrl,
    };
  } catch {
    const name = root.split('/').pop();
    return {
      id: Buffer.from(root).toString('base64').slice(0, 8),
      name,
      path: root,
      remoteUrl: null,
    };
  }
};
