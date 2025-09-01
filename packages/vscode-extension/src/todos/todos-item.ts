import { ProcessedTodos } from '@dev-dashboard/shared';
import * as vscode from 'vscode';

export class TodoItem extends vscode.TreeItem {
  public readonly processedTodo: ProcessedTodos;

  constructor(processedTodo: ProcessedTodos) {
    const label = processedTodo.content;
    const description = processedTodo.customTag
      ? processedTodo.customTag
      : processedTodo.type;

    super(label);
    this.description = description;

    this.processedTodo = processedTodo;
    this.tooltip = this.createTooltip();
    this.contextValue = this.getContextValue();
    this.command = this.getCommand();
    this.iconPath = new vscode.ThemeIcon('checklist');
  }

  private createTooltip(): string {
    if (this.processedTodo.customTag === 'placeholder') {
      return this.processedTodo.content;
    }

    let tooltip = `${this.processedTodo.type}: ${this.processedTodo.content}`;

    if (this.processedTodo.filePath) {
      const relativePath = vscode.workspace.asRelativePath(
        this.processedTodo.filePath
      );
      tooltip += `\nFile: ${relativePath}`;
    }

    if (this.processedTodo.lineNumber !== undefined) {
      tooltip += `\nLine: ${this.processedTodo.lineNumber}`;
    }

    if (this.processedTodo.filePath) {
      tooltip += `\n\nClick to open file`;
    }

    return tooltip;
  }

  private getContextValue(): string {
    if (this.processedTodo.customTag === 'placeholder') {
      return 'placeholder';
    }
    return 'todoItem';
  }

  private getCommand(): vscode.Command | undefined {
    if (
      this.processedTodo.customTag === 'placeholder' ||
      !this.processedTodo.filePath
    ) {
      return undefined;
    }

    return {
      command: 'vscode.open',
      title: 'Open File',
      arguments: [
        vscode.Uri.file(this.processedTodo.filePath),
        {
          selection:
            this.processedTodo.lineNumber !== undefined
              ? new vscode.Range(
                  this.processedTodo.lineNumber - 1,
                  0,
                  this.processedTodo.lineNumber - 1,
                  0
                )
              : undefined,
        },
      ],
    };
  }
}
