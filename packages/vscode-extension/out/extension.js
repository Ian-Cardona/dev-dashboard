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
function activate(context) {
    vscode.window.showInformationMessage('Thank you for using DevDashboard!');
    (0, api_1.setupProtectedClient)(context);
    const dashboardProvider = new dashboard_provider_1.DashboardProvider(context);
    const mainTreeView = vscode.window.createTreeView('devDashboardMain', {
        treeDataProvider: dashboardProvider,
    });
    const showWelcomeCmd = vscode.commands.registerCommand('vscode-extension.showWelcome', () => dashboardProvider.showPage('welcome'));
    const showApiConfigCmd = vscode.commands.registerCommand('vscode-extension.showApiConfig', () => dashboardProvider.showPage('apiConfig'));
    const showTodosCmd = vscode.commands.registerCommand('vscode-extension.showTodos', () => {
        const hasApiKey = context.globalState.get('apiKey');
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            dashboardProvider.showPage('apiConfig');
            return;
        }
        dashboardProvider.showPage('todos');
    });
    // const showSettingsCmd = vscode.commands.registerCommand(
    //   'vscode-extension.showSettings',
    //   () => dashboardProvider.showPage('settings')
    // );
    const scanTodosCmd = vscode.commands.registerCommand('vscode-extension.scanTodos', async () => {
        const hasApiKey = context.globalState.get('apiKey');
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            dashboardProvider.showPage('apiConfig');
            return;
        }
        await (0, scanTodos_1.scanAndSetTodosCommand)(dashboardProvider);
    });
    const syncTodosCmd = vscode.commands.registerCommand('vscode-extension.syncTodos', async () => {
        const hasApiKey = context.globalState.get('apiKey');
        if (!hasApiKey) {
            vscode.window.showWarningMessage('Please configure your API key first');
            dashboardProvider.showPage('apiConfig');
            return;
        }
        await (0, syncTodos_1.syncTodosCommand)(dashboardProvider);
    });
    const setApiKeyCmd = vscode.commands.registerCommand('vscode-extension.setApiKey', async () => {
        await (0, setApiKeys_1.setApiKeyCommand)(context);
        dashboardProvider.refresh();
    });
    const openTodoFileCmd = vscode.commands.registerCommand('vscode-extension.openTodoFile', async (todoItem) => {
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
    });
    context.subscriptions.push(mainTreeView, showWelcomeCmd, showApiConfigCmd, showTodosCmd, openTodoFileCmd, scanTodosCmd, syncTodosCmd, setApiKeyCmd);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map