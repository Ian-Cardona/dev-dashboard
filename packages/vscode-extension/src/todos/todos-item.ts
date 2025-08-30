import { ProcessedTodos } from '@dev-dashboard/shared';
import * as vscode from 'vscode';

export class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly content: string,
    public readonly processedTodo: ProcessedTodos
  ) {
    super(content, vscode.TreeItemCollapsibleState.None);

    this.tooltip = this.createTooltip(processedTodo);
    this.description = this.createDescription(processedTodo);
    this.iconPath = new vscode.ThemeIcon('checklist');
  }

  private createTooltip(todo: ProcessedTodos): string {
    let tooltip = `Content: ${todo.content}`;

    if (todo.filePath) {
      tooltip += `\nFile: ${todo.filePath}`;
    }

    if (todo.lineNumber !== undefined) {
      tooltip += `\nLine: ${todo.lineNumber}`;
    }

    return tooltip;
  }

  private createDescription(todo: ProcessedTodos): string {
    if (todo.filePath && todo.lineNumber !== undefined) {
      const fileName = todo.filePath.split('/').pop() || todo.filePath;
      return `${fileName}:${todo.lineNumber}`;
    } else if (todo.filePath) {
      const fileName = todo.filePath.split('/').pop() || todo.filePath;
      return fileName;
    }
    return '';
  }
}
