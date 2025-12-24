import axios from 'axios';

export const apiKeysApi = {
  check: async (key?: string) => {
    const headers = key ? { Authorization: `Bearer ${key}` } : {};

    // FIXME: Add to env variables
    const response = await axios.get('/api-keys/check', {
      baseURL: 'http://api.devdashboard.app/v1',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return response;
  },
};
