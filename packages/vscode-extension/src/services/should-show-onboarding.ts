import * as vscode from 'vscode';
import { clearSecretKey, getSecretKey } from '../utils/secret-key-manager';
import { API_KEY } from '../utils/constants';
import z from 'zod';

export const shouldShowOnboarding = async (
  context: vscode.ExtensionContext
): Promise<boolean> => {
  try {
    const storedApiKey = await getSecretKey(context, API_KEY);
    if (!storedApiKey) {
      return true;
    }

    const isValidFormat = z.string().safeParse(storedApiKey).success;
    if (!isValidFormat) {
      await clearSecretKey(context, API_KEY);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking stored API key:', error);
    return true;
  }
};
