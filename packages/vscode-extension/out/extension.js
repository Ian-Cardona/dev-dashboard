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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const setApiKeys_1 = require("./commands/setApiKeys");
const scanTodos_1 = require("./commands/scanTodos");
const syncTodos_1 = require("./commands/syncTodos");
const api_1 = require("./lib/api");
const dashboard_provider_1 = require("./tree-providers/dashboard-provider");
const secret_key_manager_1 = require("./utils/secret-key-manager");
const constants_1 = require("./utils/constants");
const onboarding_provider_1 = require("./webviews/onboarding/onboarding-provider");
const should_show_onboarding_1 = require("./services/should-show-onboarding");
async function activate(context) {
    vscode.window.showInformationMessage('Thank you for using DevDashboard!');
    const needsOnboarding = await (0, should_show_onboarding_1.shouldShowOnboarding)(context);
    if (needsOnboarding) {
        const onboardingProvider = new onboarding_provider_1.OnboardingProvider(context);
        context.subscriptions.push(vscode.window.registerWebviewViewProvider(onboarding_provider_1.OnboardingProvider.viewType, onboardingProvider));
        vscode.commands.executeCommand('devDashboardOnboarding.focus');
    }
    else {
        (0, api_1.setupProtectedClient)(context);
    }
    const dashboardProvider = new dashboard_provider_1.DashboardProvider(context);
    const mainTreeView = vscode.window.createTreeView('devDashboardMain', {
        treeDataProvider: dashboardProvider,
    });
    vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', !needsOnboarding);
    if (!needsOnboarding) {
        dashboardProvider.showPage('todos');
    }
    const showWelcomeCmd = vscode.commands.registerCommand('vscode-extension.showWelcome', () => { });
    const showTodosSubscription = vscode.commands.registerCommand('vscode-extension.showTodos', async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            vscode.commands.executeCommand('devDashboardOnboarding.focus');
            return;
        }
        dashboardProvider.showPage('todos');
    });
    const scanTodosSubscription = vscode.commands.registerCommand('vscode-extension.scanTodos', async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            vscode.commands.executeCommand('devDashboardOnboarding.focus');
            return;
        }
        await (0, scanTodos_1.scanAndSetTodosCommand)(dashboardProvider);
    });
    const syncTodosSubscription = vscode.commands.registerCommand('vscode-extension.syncTodos', async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            vscode.commands.executeCommand('devDashboardOnboarding.focus');
            return;
        }
        await (0, syncTodos_1.syncTodosCommand)(dashboardProvider);
    });
    const setApiKeySubscription = vscode.commands.registerCommand('vscode-extension.setApiKey', async () => {
        await (0, setApiKeys_1.setApiKeyCommand)(context);
        dashboardProvider.refresh();
        const stillNeedsOnboarding = await (0, should_show_onboarding_1.shouldShowOnboarding)(context);
        vscode.commands.executeCommand('setContext', 'devDashboard.hasApiKey', !stillNeedsOnboarding);
    });
    context.subscriptions.push(mainTreeView, showWelcomeCmd, showTodosSubscription, scanTodosSubscription, syncTodosSubscription, setApiKeySubscription);
    const onDidSaveTextDocumentSubscription = vscode.workspace.onDidSaveTextDocument(async () => {
        const hasApiKey = await (0, secret_key_manager_1.getSecretKey)(context, constants_1.API_KEY);
        if (!hasApiKey) {
            return;
        }
        await (0, scanTodos_1.scanAndSetTodosCommand)(dashboardProvider);
    });
    context.subscriptions.push(onDidSaveTextDocumentSubscription);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map