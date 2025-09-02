import * as vscode from 'vscode';
import { API_KEY } from '../utils/constants';
import { apiKeysApi } from '../apis/api-keys-api';
import { setSecretKey } from '../utils/secret-key-manager';
import { setupProtectedClient } from '../lib/api';

export const verifyApiKey = async (
  key: string,
  context: vscode.ExtensionContext
): Promise<boolean> => {
  try {
    const response = await apiKeysApi.check(key);

    if (response.status === 200) {
      await setSecretKey(context, API_KEY, key);
      setupProtectedClient(context);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('API verification failed:', error);
    return false;
  }
};
