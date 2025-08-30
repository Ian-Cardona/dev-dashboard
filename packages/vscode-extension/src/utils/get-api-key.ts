import * as vscode from 'vscode';

export const getApiKey = async (
  context: vscode.ExtensionContext
): Promise<string | undefined> => {
  return await context.secrets.get('devDashboardApiKey');
};
