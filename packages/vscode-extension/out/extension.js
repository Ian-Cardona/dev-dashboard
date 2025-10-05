"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const scanSetTodos_1 = require("./commands/scanSetTodos");
const sendTodos_1 = require("./commands/sendTodos");
const setApiKey_1 = require("./commands/setApiKey");
const api_1 = require("./lib/api");
const should_show_onboarding_1 = require("./services/should-show-onboarding");
const constants_1 = require("./utils/constants");
const secret_key_manager_1 = require("./utils/secret-key-manager");
const onboarding_provider_1 = require("./webviews/onboarding/onboarding-provider");
const todos_provider_1 = require("./webviews/todos/todos-provider");
const vscode = __importStar(require("vscode"));
const activate = async (context) => {
    vscode.window.showInformationMessage('Thank you for using DevDashboard!');
    const hasApiKey = !!(await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY));
    await vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', hasApiKey);
    await initializeUI(context);
    const todosProvider = new todos_provider_1.TodosProvider();
    registerCommands(context, todosProvider);
    registerEventListeners(context, todosProvider);
    context.subscriptions.push(vscode.window.createTreeView('devDashboardMain', {
        treeDataProvider: todosProvider,
    }));
    if (hasApiKey) {
        try {
            await (0, scanSetTodos_1.scanSetTodosCommand)(todosProvider);
        }
        catch (error) {
            console.error('Failed to scan TODOs on activation:', error);
        }
    }
};
exports.activate = activate;
const initializeUI = async (context) => {
    const needsOnboarding = await (0, should_show_onboarding_1.shouldShowOnboarding)(context);
    console.log('🔧 initializeUI - needsOnboarding:', needsOnboarding);
    await vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', !needsOnboarding);
    if (needsOnboarding) {
        console.log('🔮 Setting up onboarding...');
        const onboardingProvider = new onboarding_provider_1.OnboardingProvider(context);
        context.subscriptions.push(vscode.window.registerWebviewViewProvider(onboarding_provider_1.OnboardingProvider.viewType, onboardingProvider));
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
    }
    else {
        console.log('🚀 Setting up protected client...');
        (0, api_1.setupProtectedClient)(context);
        // Increase delay and add retry logic
        setTimeout(() => {
            console.log('🎯 Attempting to focus main view...');
            vscode.commands.executeCommand('devDashboardMain.focus');
            // Retry after another second if still loading
            setTimeout(() => {
                vscode.commands.executeCommand('devDashboardMain.focus');
            }, 1000);
        }, 1500);
    }
};
// const initializeUI = async (context: vscode.ExtensionContext) => {
//   const needsOnboarding = await shouldShowOnboarding(context);
//   await vscode.commands.executeCommand(
//     'setContext',
//     'devDashboard.hasApiKey',
//     !needsOnboarding
//   );
//   if (needsOnboarding) {
//     const onboardingProvider = new OnboardingProvider(context);
//     context.subscriptions.push(
//       vscode.window.registerWebviewViewProvider(
//         OnboardingProvider.viewType,
//         onboardingProvider
//       )
//     );
//     vscode.commands.executeCommand('devDashboardOnboarding.focus');
//   } else {
//     setupProtectedClient(context);
//     setTimeout(() => {
//       vscode.commands.executeCommand('devDashboardMain.focus');
//     }, 100);
//   }
// };
const registerCommands = (context, todosProvider) => {
    const withApiKeyGuard = (commandHandler) => async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first.');
            vscode.commands.executeCommand('devDashboardOnboarding.focus');
            return;
        }
        await commandHandler();
    };
    context.subscriptions.push(vscode.commands.registerCommand('dev-dashboard.scanTodos', withApiKeyGuard(() => (0, scanSetTodos_1.scanSetTodosCommand)(todosProvider))), vscode.commands.registerCommand('dev-dashboard.sendTodos', withApiKeyGuard(() => (0, sendTodos_1.sendTodosCommand)(todosProvider))), vscode.commands.registerCommand('dev-dashboard.showTodos', async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (hasApiKey) {
            await vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', true);
            vscode.commands.executeCommand('devDashboardMain.focus');
        }
        else {
            vscode.window.showWarningMessage('Please configure your API key first.');
            vscode.commands.executeCommand('devDashboardOnboarding.focus');
        }
    }), vscode.commands.registerCommand('dev-dashboard.setApiKey', async () => {
        await (0, setApiKey_1.setApiKeyCommand)(context);
        todosProvider.refresh();
        const needsOnboarding = await (0, should_show_onboarding_1.shouldShowOnboarding)(context);
        await vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', !needsOnboarding);
        if (!needsOnboarding) {
            (0, api_1.setupProtectedClient)(context);
            vscode.commands.executeCommand('devDashboardMain.focus');
            try {
                await (0, scanSetTodos_1.scanSetTodosCommand)(todosProvider);
            }
            catch (error) {
                console.error('Failed to scan TODOs after API key setup:', error);
            }
        }
    }), vscode.commands.registerCommand('dev-dashboard.resetSecrets', async () => {
        await (0, secret_key_manager_1.clearSecretKey)(context, constants_1.API_KEY);
        const selection = await vscode.window.showInformationMessage('Secrets cleared. A reload is required to switch to the onboarding view.', 'Reload Window');
        if (selection === 'Reload Window') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }));
};
const registerEventListeners = (context, todosProvider) => {
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (hasApiKey) {
            await (0, scanSetTodos_1.scanSetTodosCommand)(todosProvider);
        }
    }));
};
const deactivate = () => { };
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map