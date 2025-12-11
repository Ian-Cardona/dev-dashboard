import { scanSetTodosCommand } from './commands/scanSetTodos';
import { sendTodosCommand } from './commands/sendTodos';
import { setApiKeyCommand } from './commands/setApiKey';
import { setupProtectedClient } from './lib/api';
import { shouldShowOnboarding } from './services/should-show-onboarding';
import { API_KEY } from './utils/constants';
import { clearSecretKey, getSecretKey } from './utils/secret-key-manager';
import { OnboardingProvider } from './webviews/onboarding/onboarding-provider';
import { TodosProvider } from './webviews/todos/todos-provider';
import * as vscode from 'vscode';

export const activate = async (context: vscode.ExtensionContext) => {
  vscode.window.showInformationMessage('Thank you for using DevDashboard!');

  const hasApiKey = !!(await getSecretKey(context, API_KEY));
  await vscode.commands.executeCommand(
    'setContext',
    'devDashboard.hasApiKey',
    hasApiKey
  );

  await initializeUI(context);

  const todosProvider = new TodosProvider();
  registerCommands(context, todosProvider);
  registerEventListeners(context, todosProvider);

  context.subscriptions.push(
    vscode.window.createTreeView('devDashboardMain', {
      treeDataProvider: todosProvider,
    })
  );

  if (hasApiKey) {
    try {
      await scanSetTodosCommand(todosProvider);
    } catch (error) {
      console.error('Failed to scan TODOs on activation:', error);
    }
  }
};

const initializeUI = async (context: vscode.ExtensionContext) => {
  const needsOnboarding = await shouldShowOnboarding(context);

  await vscode.commands.executeCommand(
    'setContext',
    'devDashboard.hasApiKey',
    !needsOnboarding
  );

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

    setTimeout(() => {
      vscode.commands.executeCommand('devDashboardMain.focus');

      setTimeout(() => {
        vscode.commands.executeCommand('devDashboardMain.focus');
      }, 1000);
    }, 1500);
  }
};

const registerCommands = (
  context: vscode.ExtensionContext,
  todosProvider: TodosProvider
) => {
  const withApiKeyGuard = (commandHandler: () => Promise<void>) => async () => {
    const hasApiKey = await getSecretKey(context, API_KEY);
    if (!hasApiKey) {
      vscode.window.showWarningMessage('Please configure your API key first.');
      vscode.commands.executeCommand('devDashboardOnboarding.focus');
      return;
    }
    await commandHandler();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'dev-dashboard.scanTodos',
      withApiKeyGuard(() => scanSetTodosCommand(todosProvider))
    ),
    vscode.commands.registerCommand(
      'dev-dashboard.sendTodos',
      withApiKeyGuard(() => sendTodosCommand(todosProvider))
    ),
    vscode.commands.registerCommand('dev-dashboard.showTodos', async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);

      if (hasApiKey) {
        await vscode.commands.executeCommand(
          'setContext',
          'devDashboard.hasApiKey',
          true
        );
        vscode.commands.executeCommand('devDashboardMain.focus');
      } else {
        vscode.window.showWarningMessage(
          'Please configure your API key first.'
        );
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
      }
    }),

    vscode.commands.registerCommand('dev-dashboard.setApiKey', async () => {
      await setApiKeyCommand(context);
      todosProvider.refresh();
      const needsOnboarding = await shouldShowOnboarding(context);

      await vscode.commands.executeCommand(
        'setContext',
        'devDashboard.hasApiKey',
        !needsOnboarding
      );

      if (!needsOnboarding) {
        setupProtectedClient(context);
        vscode.commands.executeCommand('devDashboardMain.focus');

        try {
          await scanSetTodosCommand(todosProvider);
        } catch (error) {
          console.error('Failed to scan TODOs after API key setup:', error);
        }
      }
    }),

    vscode.commands.registerCommand('dev-dashboard.resetSecrets', async () => {
      await clearSecretKey(context, API_KEY);

      const selection = await vscode.window.showInformationMessage(
        'Secrets cleared. A reload is required to switch to the onboarding view.',
        'Reload Window'
      );

      if (selection === 'Reload Window') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    })
  );
};

const registerEventListeners = (
  context: vscode.ExtensionContext,
  todosProvider: TodosProvider
) => {
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async () => {
      const hasApiKey = await getSecretKey(context, API_KEY);
      if (hasApiKey) {
        await scanSetTodosCommand(todosProvider);
      }
    })
  );
};

export const deactivate = () => {};
