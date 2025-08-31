import * as vscode from 'vscode';
import { ProcessedTodos } from '@dev-dashboard/shared';

type PageType = 'welcome' | 'todos' | 'settings';

export class DashboardProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentPage: PageType = 'welcome';
  private todos: ProcessedTodos[] = [];
  private hasApiKey: boolean = false;

  constructor(private context: vscode.ExtensionContext) {
    this.initialize();
  }

  private async initialize() {
    this.hasApiKey = await this.hasValidApiKey();
    this.currentPage = this.hasApiKey ? 'todos' : 'welcome';
    this.refresh();
  }

  private async hasValidApiKey(): Promise<boolean> {
    const apiKey = await this.context.secrets.get('devDashboardApiKey');
    return !!apiKey;
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
      case 'todos':
        return this.getTodosItems();
      default:
        return [];
    }
  }

  private getWelcomeItems(): vscode.TreeItem[] {
    return [
      {
        label: '👋 Welcome to Dev Dashboard!',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
      },
      {
        label: this.hasApiKey
          ? '✅ Step 1: API Key Configured'
          : '🔑 Step 1: Configure API Key',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: this.hasApiKey
          ? undefined
          : {
              command: 'vscode-extension.setApiKey',
              title: 'Set API Key',
            },
        description: this.hasApiKey ? 'Complete' : 'Required',
      },
      {
        label: '📋 Step 2: Start Using TODOs',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: this.hasApiKey
          ? {
              command: 'vscode-extension.showTodos',
              title: 'Go to TODOs',
            }
          : undefined,
        description: this.hasApiKey ? 'Ready' : 'Locked',
      },
    ];
  }

  private getTodosItems(): vscode.TreeItem[] {
    if (this.todos.length === 0) {
      return [
        {
          label: 'No TODOs found.',
          collapsibleState: vscode.TreeItemCollapsibleState.None,
        },
      ];
    }
    return this.todos.map(todo => {
      return new vscode.TreeItem(
        todo.content,
        vscode.TreeItemCollapsibleState.None
      );
    });
  }
}
