import * as vscode from 'vscode';
import { setApiKeyCommand } from './commands/setApiKey';
import { scanSetTodosCommand } from './commands/scanSetTodos';
import { setupProtectedClient } from './lib/api';
import { clearSecretKey, getSecretKey } from './utils/secret-key-manager';
import { API_KEY } from './utils/constants';
import { OnboardingProvider } from './webviews/onboarding/onboarding-provider';
import { shouldShowOnboarding } from './services/should-show-onboarding';
import { TodosProvider } from './webviews/todos/todos-provider';
import { postTodosCommand } from './commands/syncTodos';

export const activate = async (context: vscode.ExtensionContext) => {
  vscode.window.showInformationMessage('Thank you for using DevDashboard!');

  const todosProvider = new TodosProvider();
  await initializeUI(context);
  registerCommands(context, todosProvider);
  registerEventListeners(context, todosProvider);

  context.subscriptions.push(
    vscode.window.createTreeView('devDashboardMain', {
      treeDataProvider: todosProvider,
    })
  );
};

const initializeUI = async (context: vscode.ExtensionContext) => {
  const needsOnboarding = await shouldShowOnboarding(context);

  vscode.commands.executeCommand(
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
      'dev-dashboard.postTodos',
      withApiKeyGuard(() => postTodosCommand(todosProvider))
    ),
    // vscode.commands.registerCommand(
    //   'dev-dashboard.showTodos',
    //   withApiKeyGuard(async () => {
    //     vscode.commands.executeCommand('devDashboardMain.focus');
    //   })
    // ),

    vscode.commands.registerCommand('dev-dashboard.showTodos', async () => {
      // Update context first
      await vscode.commands.executeCommand(
        'setContext',
        'devDashboard.hasApiKey',
        true
      );

      // Small delay to let context update
      setTimeout(() => {
        vscode.commands.executeCommand('devDashboardMain.focus');
      }, 100);
    }),

    vscode.commands.registerCommand('dev-dashboard.setApiKey', async () => {
      await setApiKeyCommand(context);
      todosProvider.refresh();
      const needsOnboarding = await shouldShowOnboarding(context);
      vscode.commands.executeCommand(
        'setContext',
        'devDashboard.hasApiKey',
        !needsOnboarding
      );
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
