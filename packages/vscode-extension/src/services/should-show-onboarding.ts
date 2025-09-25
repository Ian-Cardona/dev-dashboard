import { API_KEY } from '../utils/constants';
import { clearSecretKey, getSecretKey } from '../utils/secret-key-manager';
import * as vscode from 'vscode';
import z from 'zod';

export const shouldShowOnboarding = async (
  context: vscode.ExtensionContext
): Promise<boolean> => {
  try {
    const storedKey = await getSecretKey(context, API_KEY);
    if (!storedKey) {
      return true;
    }

    const isValidFormat = z.string().safeParse(storedKey).success;
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
