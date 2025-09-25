import { getIconForType } from './get-icon-for-type';
import { resolveFilePath } from './resolve-file-path';
import { ProcessedTodo } from '@dev-dashboard/shared';
import * as vscode from 'vscode';

export class TodoItem extends vscode.TreeItem {
  constructor(todo: ProcessedTodo) {
    const tag = todo.type === 'OTHER' ? todo.customTag : todo.type;
    const label = `${tag}: ${todo.content}`;
    super(label);

    this.tooltip = `${todo.filePath} (Line ${todo.lineNumber})`;
    this.description = todo.filePath.split('/').pop() || '';

    this.iconPath = getIconForType(todo.type);

    const absPath = resolveFilePath(todo);
    const fileUri = vscode.Uri.file(absPath);

    const lineNumber = Math.max(0, (todo.lineNumber || 1) - 1);

    this.command = {
      command: 'vscode.open',
      title: 'Open Todo',
      arguments: [
        fileUri,
        {
          selection: new vscode.Range(
            new vscode.Position(lineNumber, 0),
            new vscode.Position(lineNumber, 0)
          ),
        } as vscode.TextDocumentShowOptions,
      ],
    };
  }
}
