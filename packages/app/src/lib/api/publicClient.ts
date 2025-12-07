import { getApiUrl, getClientAppName } from '../configs/getConfig';
import axios, { AxiosError } from 'axios';

const baseURL = getApiUrl();

export const publicClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-App': getClientAppName(),
  },
  withCredentials: true,
});

publicClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);
