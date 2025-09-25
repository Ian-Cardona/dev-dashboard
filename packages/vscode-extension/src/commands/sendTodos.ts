import { postTodos } from '../services/post-todos';
import { batchTodos } from '../services/send/batch-todos';
import { TodosProvider } from '../webviews/todos/todos-provider';
import * as vscode from 'vscode';

export const sendTodosCommand = async (todosProvider: TodosProvider) => {
  try {
    const todos = todosProvider.getTodos();
    const projectName = todosProvider.getProjectName();
    const batch = batchTodos(todos, projectName);

    await postTodos(batch);
    vscode.window.showInformationMessage(`Synced TODOs Successfully`);
  } catch (error) {
    let errorMessage;
    console.error('Failed to scan and populate TODOs:', error);
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Unknown error';
    }
    vscode.window.showErrorMessage(`Failed to sync TODOs: ${errorMessage}`);
  }
};
