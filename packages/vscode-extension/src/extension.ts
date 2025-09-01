import * as vscode from 'vscode';
import { setApiKeyCommand } from './commands/setApiKeys';
import { scanAndSetTodosCommand } from './commands/scanTodos';
import { syncTodosCommand } from './commands/syncTodos';
import { setupProtectedClient } from './lib/api';
import { TodosProvider } from './tree-providers/todos-provider';
import { getSecretKey } from './utils/secret-key-manager';
import { API_KEY } from './utils/constants';
import { OnboardingProvider } from './webviews/onboarding/onboarding-provider';
import { shouldShowOnboarding } from './services/should-show-onboarding';

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('Thank you for using DevDashboard!');

  const needsOnboarding = await shouldShowOnboarding(context);

  if (needsOnboarding) {
    const onboardingProvider = new OnboardingProvider(context);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        OnboardingProvider.viewType,
        onboardingProvider
      )
    );
    vscode.commands.executeCommand('devDashboardOnboarding.focus');
  } else {
    setupProtectedClient(context);
  }

  // Create TodosProvider directly
  const todosProvider = new TodosProvider();
  const todosTreeView = vscode.window.createTreeView('devDashboardMain', {
    treeDataProvider: todosProvider,
  });

  vscode.commands.executeCommand(
    'setContext',
    'devDashboard.hasApiKey',
    !needsOnboarding
  );

  const showTodosSubscription = vscode.commands.registerCommand(
    'vscode-extension.showTodos',
    async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
        return;
      }
      vscode.commands.executeCommand('devDashboardMain.focus');
    }
  );

  const scanTodosSubscription = vscode.commands.registerCommand(
    'vscode-extension.scanTodos',
    async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
        return;
      }
      await scanAndSetTodosCommand(todosProvider);
    }
  );

  const syncTodosSubscription = vscode.commands.registerCommand(
    'vscode-extension.syncTodos',
    async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (!hasApiKey) {
        vscode.window.showWarningMessage('Please configure your API key first');
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
        return;
      }
      await syncTodosCommand(todosProvider);
    }
  );

  const resetSecretsCmd = vscode.commands.registerCommand(
    'vscode-extension.resetSecrets',
    async () => {
      await context.secrets.delete(API_KEY);
      vscode.window.showInformationMessage('All extension secrets cleared.');
    }
  );

  const setApiKeySubscription = vscode.commands.registerCommand(
    'vscode-extension.setApiKey',
    async () => {
      await setApiKeyCommand(context);
      todosProvider.refresh();

      const stillNeedsOnboarding = await shouldShowOnboarding(context);
      vscode.commands.executeCommand(
        'setContext',
        'devDashboard.hasApiKey',
        !stillNeedsOnboarding
      );
    }
  );

  context.subscriptions.push(
    todosTreeView,
    showTodosSubscription,
    scanTodosSubscription,
    syncTodosSubscription,
    resetSecretsCmd,
    setApiKeySubscription
  );

  const onDidSaveTextDocumentSubscription =
    vscode.workspace.onDidSaveTextDocument(async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (!hasApiKey) {
        return;
      }
      await scanAndSetTodosCommand(todosProvider);
    });

  context.subscriptions.push(onDidSaveTextDocumentSubscription);
}

export function deactivate() {}
