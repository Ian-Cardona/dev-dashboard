import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getApiKey } from '../utils/get-api-key';
import * as vscode from 'vscode';

// const baseURL = process.env.API_URL || 'http://localhost:3000';
const baseURL = 'http://localhost:3000/v1';

export const protectedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

protectedClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const extension = vscode.extensions.getExtension(
      'iancardona.dev-dashboard'
    );
    const context = extension?.exports?.extensionContext;
    const apiKey = context ? await getApiKey(context) : undefined;
    if (apiKey) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  }
);

export const setupProtectedClient = (context: vscode.ExtensionContext) => {
  protectedClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const apiKey = await getApiKey(context);
      console.log('ApiKey', apiKey);
      if (apiKey) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${apiKey}`;
      }
      return config;
    }
  );
};
