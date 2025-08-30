import * as vscode from 'vscode';
import { ProcessedTodos } from '@dev-dashboard/shared';

type PageType = 'welcome' | 'apiConfig' | 'todos' | 'settings';

export class DashboardProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentPage: PageType = 'welcome';
  private todos: ProcessedTodos[] = [];

  constructor(private context: vscode.ExtensionContext) {
    const hasApiKey = this.context.globalState.get<string>('apiKey');
    this.currentPage = hasApiKey ? 'todos' : 'welcome';
  }

  showPage(page: PageType): void {
    this.currentPage = page;
    this.refresh();
    vscode.commands.executeCommand(
      'setContext',
      'devDashboard.currentPage',
      page
    );
  }

  setTodos(todos: ProcessedTodos[]): void {
    this.todos = todos;
    this.refresh();
  }

  getTodos(): ProcessedTodos[] {
    return this.todos;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    switch (this.currentPage) {
      case 'welcome':
        return this.getWelcomeItems();
      case 'apiConfig':
        return this.getApiConfigItems();
      default:
        return [];
    }
  }

  private getWelcomeItems(): vscode.TreeItem[] {
    const hasApiKey = this.context.globalState.get<string>('apiKey');

    return [
      {
        label: '👋 Welcome to Dev Dashboard!',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
      },
      {
        label: hasApiKey
          ? '✅ Step 1: API Key Configured'
          : '🔑 Step 1: Configure API Key',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: hasApiKey
          ? undefined
          : {
              command: 'vscode-extension.setApiKey',
              title: 'Set API Key',
            },
        description: hasApiKey ? 'Complete' : 'Required',
      },
      {
        label: hasApiKey
          ? '📋 Step 2: Start Using TODOs'
          : '📋 Step 2: Start Using TODOs',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: hasApiKey
          ? {
              command: 'vscode-extension.showTodos',
              title: 'Go to TODOs',
            }
          : undefined,
        description: hasApiKey ? 'Ready' : 'Locked',
      },
    ];
  }

  private getApiConfigItems(): vscode.TreeItem[] {
    const apiKey = this.context.globalState.get<string>('apiKey');

    if (apiKey) {
      return [
        {
          label: '✅ API Key Configured',
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          description: `***${apiKey.slice(-4)}`,
        },
        {
          label: '🔄 Update API Key',
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          command: {
            command: 'vscode-extension.setApiKey',
            title: 'Update API Key',
          },
        },
      ];
    } else {
      return [
        {
          label: '❌ No API Key Set',
          collapsibleState: vscode.TreeItemCollapsibleState.None,
        },
        {
          label: '🔑 Add API Key',
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          command: {
            command: 'vscode-extension.setApiKey',
            title: 'Set API Key',
          },
        },
      ];
    }
  }
}
