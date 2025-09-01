import * as vscode from 'vscode';
import { scanTodos } from '../services/scan-todos';
import { TodosProvider } from '../tree-providers/todos-provider';

export const scanAndSetTodosCommand = async (todosProvider: TodosProvider) => {
  try {
    const todos = await scanTodos();
    todosProvider.setTodos(todos);
    vscode.window.showInformationMessage(
      `Scanned and found ${todos.length} TODOs.`
    );
  } catch (error) {
    let errorMessage;
    console.error('Failed to scan and populate TODOs:', error);
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Unknown error';
    }
    vscode.window.showErrorMessage(
      `Failed to scan and populate TODOs: ${errorMessage}`
    );
  }
};
