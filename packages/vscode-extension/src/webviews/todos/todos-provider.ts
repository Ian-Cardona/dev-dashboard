import { TodoItem } from './todo-item';
import { ProcessedTodo } from '@dev-dashboard/shared';
import * as vscode from 'vscode';

class EmptyStateItem extends vscode.TreeItem {
  constructor() {
    super(
      'No TODOs found in your workspace',
      vscode.TreeItemCollapsibleState.None
    );
    this.description = 'Add TODO comments to your code';
    this.iconPath = new vscode.ThemeIcon('info');
    this.contextValue = 'emptyState';
    this.tooltip =
      'Add comments like // TODO: fix this or // FIXME: update this to your code files';

    // Make it clickable to trigger scan
    this.command = {
      command: 'dev-dashboard.scanTodos',
      title: 'Scan for TODOs',
    };
  }
}

class ScanPromptItem extends vscode.TreeItem {
  constructor() {
    super('Click to scan for TODOs', vscode.TreeItemCollapsibleState.None);
    this.iconPath = new vscode.ThemeIcon('search');
    this.contextValue = 'scanPrompt';
    this.tooltip =
      'Scan your workspace for TODO, FIXME, HACK, NOTE, and BUG comments';

    this.command = {
      command: 'dev-dashboard.scanTodos',
      title: 'Scan for TODOs',
    };
  }
}

class SupportedFormatsItem extends vscode.TreeItem {
  constructor() {
    super('Supported formats', vscode.TreeItemCollapsibleState.Collapsed);
    this.iconPath = new vscode.ThemeIcon('list-unordered');
    this.contextValue = 'supportedFormats';
    this.tooltip = 'TODO, FIXME, HACK, NOTE, BUG, XXX';
  }
}

class FormatItem extends vscode.TreeItem {
  constructor(format: string) {
    super(format, vscode.TreeItemCollapsibleState.None);
    this.iconPath = new vscode.ThemeIcon('symbol-keyword');
    this.contextValue = 'formatItem';
  }
}

export class TodosProvider
  implements
    vscode.TreeDataProvider<
      | TodoItem
      | EmptyStateItem
      | ScanPromptItem
      | SupportedFormatsItem
      | FormatItem
    >
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    TodoItem | undefined | void
  > = new vscode.EventEmitter<TodoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private _ProcessedTodo: ProcessedTodo[] = [];
  private _projectName: string = '';

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setProjectName(projectName: string): void {
    this._projectName = projectName;
    this.refresh();
  }

  getProjectName(): string {
    return this._projectName;
  }

  setTodos(todos: ProcessedTodo[]): void {
    this._ProcessedTodo = todos;
    this.refresh();
  }

  getTodos(): ProcessedTodo[] {
    return this._ProcessedTodo;
  }

  getTreeItem(
    element:
      | TodoItem
      | EmptyStateItem
      | ScanPromptItem
      | SupportedFormatsItem
      | FormatItem
  ): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?:
      | TodoItem
      | EmptyStateItem
      | ScanPromptItem
      | SupportedFormatsItem
      | FormatItem
  ): (
    | TodoItem
    | EmptyStateItem
    | ScanPromptItem
    | SupportedFormatsItem
    | FormatItem
  )[] {
    if (element instanceof SupportedFormatsItem) {
      return [
        new FormatItem('TODO'),
        new FormatItem('FIXME'),
        new FormatItem('HACK'),
        new FormatItem('NOTE'),
        new FormatItem('BUG'),
        new FormatItem('XXX'),
      ];
    }

    if (element) {
      return [];
    }

    if (this._ProcessedTodo.length === 0) {
      return [
        new EmptyStateItem(),
        new ScanPromptItem(),
        new SupportedFormatsItem(),
      ];
    }

    return this._ProcessedTodo.map(todo => new TodoItem(todo));
  }
}
