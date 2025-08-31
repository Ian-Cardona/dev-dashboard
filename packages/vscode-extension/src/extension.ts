import * as vscode from 'vscode';
import { setApiKeyCommand } from './commands/setApiKeys';
import { scanAndSetTodosCommand } from './commands/scanTodos';
import { syncTodosCommand } from './commands/syncTodos';
import { setupProtectedClient } from './lib/api';
import { DashboardProvider } from './tree-providers/dashboard-provider';
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

  const dashboardProvider = new DashboardProvider(context);
  const mainTreeView = vscode.window.createTreeView('devDashboardMain', {
    treeDataProvider: dashboardProvider,
  });

  vscode.commands.executeCommand(
    'setContext',
    'devDashboard.hasApiKey',
    !needsOnboarding
  );

  if (!needsOnboarding) {
    dashboardProvider.showPage('todos');
  }

  const showWelcomeCmd = vscode.commands.registerCommand(
    'vscode-extension.showWelcome',
    () => {}
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
      dashboardProvider.showPage('todos');
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
      await scanAndSetTodosCommand(dashboardProvider);
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
      await syncTodosCommand(dashboardProvider);
    }
  );

  const setApiKeySubscription = vscode.commands.registerCommand(
    'vscode-extension.setApiKey',
    async () => {
      await setApiKeyCommand(context);
      dashboardProvider.refresh();

      const stillNeedsOnboarding = await shouldShowOnboarding(context);
      vscode.commands.executeCommand(
        'setContext',
        'devDashboard.hasApiKey',
        !stillNeedsOnboarding
      );
    }
  );

  context.subscriptions.push(
    mainTreeView,
    showWelcomeCmd,
    showTodosSubscription,
    scanTodosSubscription,
    syncTodosSubscription,
    setApiKeySubscription
  );

  const onDidSaveTextDocumentSubscription =
    vscode.workspace.onDidSaveTextDocument(async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (!hasApiKey) {
        return;
      }
      await scanAndSetTodosCommand(dashboardProvider);
    });

  context.subscriptions.push(onDidSaveTextDocumentSubscription);
}

export function deactivate() {}
