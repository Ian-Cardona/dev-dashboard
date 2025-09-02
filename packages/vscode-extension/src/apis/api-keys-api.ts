import axios from 'axios';

export const apiKeysApi = {
  check: async (key?: string) => {
    const headers = key ? { Authorization: `Bearer ${key}` } : {};

    // FIXME: Make this dynamic API endpoint
    const response = await axios.get('/api-keys/check', {
      baseURL: 'http://localhost:3000/v1',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return response;
  },
};
