import { getApiUrl, getClientAppName } from '../configs/getConfig';
import axios from 'axios';

const baseURL = getApiUrl();
// const baseURL = '/api';

export const publicClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-App': getClientAppName(),
  },
  withCredentials: true,
});
