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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMTBiZTc0Mi1jMGJkLTQ0NGYtOTk5OC1hZGYyZjY1NzEzMjQiLCJlbWFpbCI6ImlhbmNhcmRvbmEwMDFAZ21haWwuY29tIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1NjM1NzE4NywiZXhwIjoxNzU2MzU4OTg3LCJhdWQiOiJEZXZEYXNoYm9hcmRVSSIsImlzcyI6IkRldkRhc2hib2FyZCJ9.5METYorOLf93M7wn7vYddXOwdYI2I6JmKQYp9L9ME8U';
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
