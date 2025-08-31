import * as vscode from 'vscode';
import { setSecretKey } from '../utils/secret-key-manager';
import { API_KEY } from '../utils/constants';

export const setApiKeyCommand = async (context: vscode.ExtensionContext) => {
  try {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter your API key',
      placeHolder: 'API Key',
      ignoreFocusOut: true,
      password: true,
    });
    if (!apiKey) {
      vscode.window.showWarningMessage(
        'No API key entered. Operation cancelled.'
      );
      return;
    }
    await setSecretKey(context, API_KEY, apiKey);
    vscode.window.showInformationMessage('API key saved successfully.');
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    vscode.window.showErrorMessage(
      `Failed to save API key: ${errorMessage ?? error}`
    );
  }
};
