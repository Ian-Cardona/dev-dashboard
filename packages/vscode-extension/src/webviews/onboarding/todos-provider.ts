

import * as vscode from 'vscode';

class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.description = label;
  }
}

export class TodosProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TodoItem | undefined | void
    new vscode.EventEmitter<TodoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private todos: string[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setTodos(todos: string[]): void {
    this.todos = todos;
    this.refresh();
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<TodoItem[]> {
    if (this.todos.length === 0) {
      return Promise.resolve([new TodoItem('No TODOs found')]);
    }
    return Promise.resolve(this.todos.map(todo => new TodoItem(todo)));
  }
}