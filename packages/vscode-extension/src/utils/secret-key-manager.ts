import * as vscode from 'vscode';

export const getSecretKey = async (
  context: vscode.ExtensionContext,
  key: string
): Promise<string | undefined> => {
  return await context.secrets.get(key);
};

export const setSecretKey = async (
  context: vscode.ExtensionContext,
  key: string,
  value: string
): Promise<void> => {
  await context.secrets.store(key, value);
};

export const clearSecretKey = async (
  context: vscode.ExtensionContext,
  key: string
): Promise<void> => {
  await context.secrets.delete(key);
};
