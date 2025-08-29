import * as vscode from 'vscode';
import { scanTodos } from './services/scan';

export function activate(context: vscode.ExtensionContext) {
  console.log('Thank you for using DevDashboard!');
  vscode.window.showInformationMessage('DevDashboard Extension Activated!');

  const scanCommand = vscode.commands.registerCommand(
    'vscode-extension.scanTodos',
    async () => {
      try {
        await scanTodos();
      } catch (error) {
        console.error('Scan TODOs error:', error);
        vscode.window.showErrorMessage(`Failed to scan TODOs: ${error}`);
      }
    }
  );

  context.subscriptions.push(scanCommand);
}

export function deactivate() {}
