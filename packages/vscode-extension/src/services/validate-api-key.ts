import * as vscode from 'vscode';
import { API_KEY } from '../utils/constants';
import { apiKeysApi } from '../api-keys/api-keys-api';
import { setSecretKey } from '../utils/secret-key-manager';
export const verifyApiKey = async (
  apiKey: string,
  context: vscode.ExtensionContext
): Promise<boolean> => {
  try {
    const response = await apiKeysApi.checkConnection(apiKey);

    if (response.status === 200) {
      await setSecretKey(context, API_KEY, apiKey);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('API verification failed:', error);
    return false;
  }
};
