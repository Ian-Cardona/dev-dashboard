import * as vscode from 'vscode';
import * as path from 'path';
import { ProcessedTodos } from '@dev-dashboard/shared';
import { findGitRoot } from '../../utils/repository-manager';

export const resolveFilePath = (
  todo: ProcessedTodos & { projectName?: string }
): string => {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return todo.filePath;

  const gitRoot = findGitRoot(workspaceRoot);
  if (gitRoot) {
    return path.join(gitRoot, todo.filePath);
  }

  const projectName = todo.projectName;
  if (!projectName) {
    return path.join(workspaceRoot, todo.filePath);
  }

  const wsBase = path.basename(workspaceRoot);
  const fileStartsWithProject =
    todo.filePath.startsWith(projectName + path.sep) ||
    todo.filePath.startsWith(`${projectName}/`);

  return wsBase === projectName || fileStartsWithProject
    ? path.join(workspaceRoot, todo.filePath)
    : path.join(workspaceRoot, projectName, todo.filePath);
};
