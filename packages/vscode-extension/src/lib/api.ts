import axios, { type InternalAxiosRequestConfig } from 'axios';
import * as vscode from 'vscode';
import { getSecretKey } from '../utils/secret-key-manager';
import { API_KEY } from '../utils/constants';

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

// protectedClient.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     const extension = vscode.extensions.getExtension(
//       'iancardona.dev-dashboard'
//     );
//     const context = extension?.exports?.extensionContext;
//     const apiKey = context ? await getSecretKey(context, API_KEY) : undefined;
//     if (apiKey) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${apiKey}`;
//     }
//     return config;
//   }~
// );

export const setupProtectedClient = (context: vscode.ExtensionContext) => {
  protectedClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const apiKey = await getSecretKey(context, API_KEY);
      if (apiKey) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${apiKey}`;
      }
      return config;
    }
  );
};
