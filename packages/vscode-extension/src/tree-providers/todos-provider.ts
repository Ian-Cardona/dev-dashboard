import * as vscode from 'vscode';
import { ProcessedTodos } from '@dev-dashboard/shared';
import { TodoItem } from '../todos/todos-item';

export class TodosProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TodoItem | undefined | null | void
  > = new vscode.EventEmitter<TodoItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TodoItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private todos: TodoItem[] = [];
  private _processedTodos: ProcessedTodos[] = [];

  setTodos(todos: ProcessedTodos[]) {
    this._processedTodos = todos;
    this.todos = todos.map(item => new TodoItem(item.content, item));
    this._onDidChangeTreeData.fire();
  }

  getTodos(): ProcessedTodos[] {
    return this._processedTodos;
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TodoItem): Thenable<TodoItem[]> {
    if (element) {
      return Promise.resolve([]);
    }
    if (this.todos.length === 0) {
      const placeholder = new TodoItem('No TODOs found. Run Scan Todos.', {
        content: '',
        filePath: '',
        lineNumber: 0,
        type: 'OTHER',
        customTag: 'placeholder',
      });
      return Promise.resolve([placeholder]);
    }
    return Promise.resolve(this.todos);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
