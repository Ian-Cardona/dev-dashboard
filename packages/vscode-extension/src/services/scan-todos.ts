import * as vscode from 'vscode';
import { ProcessedTodo, RawTodo } from '@dev-dashboard/shared';
import {
  findPivotRoot,
  getSourceFiles,
  makeRelativePathTodo,
  tagTodos,
  scanFile,
} from './scan';

export const scanTodos = async (): Promise<{
  todos: ProcessedTodo[];
  projectName: string;
}> => {
  try {
    if (!vscode.workspace.workspaceFolders) {
      throw new Error('No workspace folder is open.');
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0];
    const workspacePath = workspaceFolder.uri.fsPath;

    const { pivotRoot, projectName } = findPivotRoot(workspacePath);

    const files = await getSourceFiles(workspacePath);

    const todoPromises = files.map(file => scanFile(file));
    const todoArrays = await Promise.all(todoPromises);
    const rawTodos: RawTodo[] = todoArrays.flat();

    const todosWithRelativePaths = rawTodos.map(todo =>
      makeRelativePathTodo({ ...todo }, pivotRoot)
    );

    const todos: ProcessedTodo[] = tagTodos(todosWithRelativePaths);

    return { todos, projectName };
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
