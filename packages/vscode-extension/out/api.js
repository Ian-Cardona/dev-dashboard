'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.protectedClient = void 0;
const axios_1 = __importDefault(require('axios'));
// const baseURL = process.env.API_URL || 'http://localhost:3000';
const baseURL = 'http://localhost:3000';
exports.protectedClient = axios_1.default.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});
exports.protectedClient.interceptors.request.use(config => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NmU4MDA3MC04OTg1LTQ0ODMtYmQwNC0wMWY4ODI4MzJhYzUiLCJlbWFpbCI6ImlhbmNhcmRvbmEwMDFAZ21haWwuY29tIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1NjIxNDgxOCwiZXhwIjoxNzU2MjE2NjE4LCJhdWQiOiJEZXZEYXNoYm9hcmRVSSIsImlzcyI6IkRldkRhc2hib2FyZCJ9.OfVIxhtChm83YD8E7-PrPdEhHY79a0c1JdNsYTWFQEA';
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
