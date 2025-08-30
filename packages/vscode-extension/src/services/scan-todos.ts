import * as vscode from 'vscode';
import { ProcessedTodos, RawTodo } from '@dev-dashboard/shared';
import { getSourceFiles, processTodos, scanFile } from './scan';
import { findPivotRoot, makeRelativePathTodo } from './scan/repository';

export const scanTodos = async () => {
  try {
    if (!vscode.workspace.workspaceFolders) {
      throw new Error('No workspace folder is open.');
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0];
    const workspacePath = workspaceFolder.uri.fsPath;

    const { pivotRoot } = findPivotRoot(workspacePath);

    const files = await getSourceFiles(workspacePath);

    const todoPromises = files.map(file => scanFile(file));
    const todoArrays = await Promise.all(todoPromises);
    const rawTodos: RawTodo[] = todoArrays.flat();

    const todosWithRelativePaths = rawTodos.map(todo =>
      makeRelativePathTodo(todo, pivotRoot)
    );

    const processedTodos: ProcessedTodos[] = processTodos(
      todosWithRelativePaths
    );

    return processedTodos;
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Unknown error';
    }
    throw new Error(errorMessage);
  }
};
