import * as vscode from 'vscode';
import { postTodos } from '../services/post-todos';
import { TodosProvider } from '../webviews/todos/todos-provider';

export const postTodosCommand = async (todosProvider: TodosProvider) => {
  try {
    const todos = todosProvider.getTodos();
    console.log('Todos', todos);
    await postTodos(todos);
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
