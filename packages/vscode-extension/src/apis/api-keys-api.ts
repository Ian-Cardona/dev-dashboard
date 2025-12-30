import axios from 'axios';

export const apiKeysApi = {
  check: async (key?: string) => {
    const headers = key ? { Authorization: `Bearer ${key}` } : {};

    const response = await axios.get('/api-keys/check', {
      baseURL: 'https://api.devdashboard.app/v1',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return response;
  },
};
