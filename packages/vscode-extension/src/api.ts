import axios, { type InternalAxiosRequestConfig } from 'axios';

// const baseURL = process.env.API_URL || 'http://localhost:3000';
const baseURL = 'http://localhost:3000';

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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NmU4MDA3MC04OTg1LTQ0ODMtYmQwNC0wMWY4ODI4MzJhYzUiLCJlbWFpbCI6ImlhbmNhcmRvbmEwMDFAZ21haWwuY29tIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1NjIxNDgxOCwiZXhwIjoxNzU2MjE2NjE4LCJhdWQiOiJEZXZEYXNoYm9hcmRVSSIsImlzcyI6IkRldkRhc2hib2FyZCJ9.OfVIxhtChm83YD8E7-PrPdEhHY79a0c1JdNsYTWFQEA';
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
