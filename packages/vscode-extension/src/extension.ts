import * as vscode from 'vscode';
import { setApiKeyCommand } from './commands/setApiKeys';
import { scanAndSetTodosCommand } from './commands/scanTodos';
import { syncTodosCommand } from './commands/syncTodos';
import { setupProtectedClient } from './lib/api';
import { TodoItem } from './todos/todos-item';
import { DashboardProvider } from './tree-providers/dashboard-provider';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('Thank you for using DevDashboard!');

  setupProtectedClient(context);

  const dashboardProvider = new DashboardProvider(context);
  const mainTreeView = vscode.window.createTreeView('devDashboardMain', {
    treeDataProvider: dashboardProvider,
  });

  const showWelcomeCmd = vscode.commands.registerCommand(
    'vscode-extension.showWelcome',
    () => dashboardProvider.showPage('welcome')
  );

  const showApiConfigCmd = vscode.commands.registerCommand(
    'vscode-extension.showApiConfig',
    () => dashboardProvider.showPage('apiConfig')
  );

  const showTodosCmd = vscode.commands.registerCommand(
    'vscode-extension.showTodos',
    () => {
      const hasApiKey = context.globalState.get<string>('apiKey');
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        dashboardProvider.showPage('apiConfig');
        return;
      }
      dashboardProvider.showPage('todos');
    }
  );

  const showSettingsCmd = vscode.commands.registerCommand(
    'vscode-extension.showSettings',
    () => dashboardProvider.showPage('settings')
  );

  const scanTodosCmd = vscode.commands.registerCommand(
    'vscode-extension.scanTodos',
    async () => {
      const hasApiKey = context.globalState.get<string>('apiKey');
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        dashboardProvider.showPage('apiConfig');
        return;
      }
      await scanAndSetTodosCommand(dashboardProvider);
    }
  );

  const syncTodosCmd = vscode.commands.registerCommand(
    'vscode-extension.syncTodos',
    async () => {
      const hasApiKey = context.globalState.get<string>('apiKey');
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        dashboardProvider.showPage('apiConfig');
        return;
      }
      await syncTodosCommand(dashboardProvider);
    }
  );

  const setApiKeyCmd = vscode.commands.registerCommand(
    'vscode-extension.setApiKey',
    async () => {
      await setApiKeyCommand(context);
      dashboardProvider.refresh();
    }
  );

  const openTodoFileCmd = vscode.commands.registerCommand(
    'vscode-extension.openTodoFile',
    async (todoItem: TodoItem) => {
      const todo = todoItem.processedTodo;
      if (todo.filePath) {
        const uri = vscode.Uri.file(todo.filePath);
        const doc = await vscode.workspace.openTextDocument(uri);
        const editor = await vscode.window.showTextDocument(doc);

        if (todo.lineNumber !== undefined) {
          const position = new vscode.Position(todo.lineNumber - 1, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(new vscode.Range(position, position));
        }
      }
    }
  );

  context.subscriptions.push(
    mainTreeView,
    showWelcomeCmd,
    showApiConfigCmd,
    showTodosCmd,
    showSettingsCmd,
    openTodoFileCmd,
    scanTodosCmd,
    syncTodosCmd,
    setApiKeyCmd
  );
}

export function deactivate() {}
