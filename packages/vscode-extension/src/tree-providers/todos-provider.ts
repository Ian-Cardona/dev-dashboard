import * as vscode from 'vscode';
import { ProcessedTodos } from '@dev-dashboard/shared';

export class TodosProvider implements vscode.TreeDataProvider<string> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    string | undefined | null | void
  > = new vscode.EventEmitter<string | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> =
    this._onDidChangeTreeData.event;

  private _processedTodos: ProcessedTodos[] = [];

  setTodos(todos: ProcessedTodos[]) {
    this._processedTodos = todos;
    this._onDidChangeTreeData.fire();
  }

  getTodos(): ProcessedTodos[] {
    return this._processedTodos;
  }

  getTreeItem(element: string): vscode.TreeItem {
    return new vscode.TreeItem(element);
  }

  getChildren(): Thenable<string[]> {
    if (this._processedTodos.length === 0) {
      return Promise.resolve([
        'No TODOs found - Click "Scan TODOs" to search your workspace',
      ]);
    }

    const todoStrings = this._processedTodos.map(
      todo => `${todo.type}: ${todo.content}`
    );
    return Promise.resolve(todoStrings);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
