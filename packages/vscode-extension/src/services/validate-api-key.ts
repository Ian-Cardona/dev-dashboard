import { apiKeysApi } from '../apis/api-keys-api';
import { setupProtectedClient } from '../lib/api';
import { API_KEY } from '../utils/constants';
import { setSecretKey } from '../utils/secret-key-manager';
import * as vscode from 'vscode';

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
