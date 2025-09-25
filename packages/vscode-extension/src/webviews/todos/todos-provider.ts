import { TodoItem } from './todo-item';
import { ProcessedTodo } from '@dev-dashboard/shared';
import * as vscode from 'vscode';

export class TodosProvider implements vscode.TreeDataProvider<TodoItem> {
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

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<TodoItem[]> {
    return Promise.resolve(this._ProcessedTodo.map(todo => new TodoItem(todo)));
  }
}
