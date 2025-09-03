import * as vscode from 'vscode';

export const getIconForType = (type: string): vscode.ThemeIcon => {
  let iconId: string;
  switch (type) {
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
  return new vscode.ThemeIcon(iconId);
};
