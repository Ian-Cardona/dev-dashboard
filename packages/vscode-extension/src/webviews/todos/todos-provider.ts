import * as vscode from 'vscode';
import { ProcessedTodos } from '@dev-dashboard/shared';
import { TodoItem } from './todo-item';

export class TodosProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TodoItem | undefined | void
  > = new vscode.EventEmitter<TodoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private _processedTodos: ProcessedTodos[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setTodos(todos: ProcessedTodos[]): void {
    this._processedTodos = todos;
    this.refresh();
  }

  getTodos(): ProcessedTodos[] {
    return this._processedTodos;
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<TodoItem[]> {
    if (this._processedTodos.length === 0) {
      const fallbackTodo: ProcessedTodos = {
        content: 'No TODOs found',
        filePath: '',
        lineNumber: 0,
        type: 'TODO',
      };
      return Promise.resolve([new TodoItem(fallbackTodo)]);
    }
    return Promise.resolve(
      this._processedTodos.map(todo => new TodoItem(todo))
    );
  }
}
