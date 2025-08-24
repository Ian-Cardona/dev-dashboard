import axios, { type InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.API_URL || 'http://localhost:3000';

export const protectedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

protectedClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzVlZTczOS03ZjA0LTRkMTgtYmUxYi1kMTIzYzJhMWM4OTciLCJlbWFpbCI6ImlhbmNhcmRvbmEwMDFAZ21haWwuY29tIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1NjA0NjIyNCwiZXhwIjoxNzU2MDQ4MDI0LCJhdWQiOiJEZXZEYXNoYm9hcmRVSSIsImlzcyI6IkRldkRhc2hib2FyZCJ9.F3oWwFhM8kJ3GZqdzGGtFgjmIXT6XTLXjawMxszwdWc';
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
