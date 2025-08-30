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
    return Promise.resolve(this.todos);
  }
}
