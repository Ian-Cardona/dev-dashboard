import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const devClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
