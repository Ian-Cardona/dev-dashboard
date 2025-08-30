import * as vscode from 'vscode';
import { scanTodos } from '../services/scan-todos';
import { DashboardProvider } from '../tree-providers/dashboard-provider';

export const scanAndSetTodosCommand = async (
  dashboardProvider: DashboardProvider
) => {
  try {
    const todos = await scanTodos();
    dashboardProvider.setTodos(todos);
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
