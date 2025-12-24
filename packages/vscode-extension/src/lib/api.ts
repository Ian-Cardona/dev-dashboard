import { API_KEY } from '../utils/constants';
import { getSecretKey } from '../utils/secret-key-manager';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import * as vscode from 'vscode';

const baseURL = 'http://api.devdashboard.app/v1';

export const protectedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

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
