import * as vscode from 'vscode';
import * as path from 'path';
import { ProcessedTodos } from '@dev-dashboard/shared';

export class TodoItem extends vscode.TreeItem {
  constructor(todo: ProcessedTodos) {
    const tag = todo.type === 'OTHER' ? todo.customTag : todo.type;
    const label = `${tag}: ${todo.content}`;
    super(label);

    this.tooltip = `${todo.filePath} (Line ${todo.lineNumber})`;
    this.description = todo.filePath.split('/').pop() || '';

    let iconId: string;
    switch (todo.type) {
      case 'TODO':
        iconId = 'check';
        break;
      case 'FIXME':
        iconId = 'flame';
        break;
      case 'HACK':
        iconId = 'wrench';
        break;
      case 'NOTE':
        iconId = 'note';
        break;
      case 'BUG':
        iconId = 'bug';
        break;
      case 'XXX':
        iconId = 'error';
        break;
      case 'OTHER':
        iconId = 'symbol-misc';
        break;
      default:
        iconId = 'circle-outline';
    }
    this.iconPath = new vscode.ThemeIcon(iconId);

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const absPath = workspaceRoot
      ? path.join(workspaceRoot, todo.filePath)
      : todo.filePath;
    const fileUri = vscode.Uri.file(absPath);

    this.command = {
      command: 'vscode.open',
      title: 'Open Todo',
      arguments: [
        fileUri,
        {
          selection: new vscode.Range(
            new vscode.Position(todo.lineNumber - 1, 0),
            new vscode.Position(todo.lineNumber - 1, 0)
          ),
        } as vscode.TextDocumentShowOptions,
      ],
    };
  }
}
