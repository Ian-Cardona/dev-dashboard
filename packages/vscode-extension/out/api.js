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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMTBiZTc0Mi1jMGJkLTQ0NGYtOTk5OC1hZGYyZjY1NzEzMjQiLCJlbWFpbCI6ImlhbmNhcmRvbmEwMDFAZ21haWwuY29tIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1NjM1NzE4NywiZXhwIjoxNzU2MzU4OTg3LCJhdWQiOiJEZXZEYXNoYm9hcmRVSSIsImlzcyI6IkRldkRhc2hib2FyZCJ9.5METYorOLf93M7wn7vYddXOwdYI2I6JmKQYp9L9ME8U';
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//# sourceMappingURL=api.js.map
