import { getApiUrl, getClientAppName } from '../utils/configs/envConfig';
import axios, { type InternalAxiosRequestConfig } from 'axios';

const baseURL = getApiUrl();

export const publicClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-App': getClientAppName(),
  },
  withCredentials: true,
});

export const protectedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-App': getClientAppName(),
  },
  withCredentials: true,
});

protectedClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
