import axios from 'axios';

export const apiKeysApi = {
  checkConnection: async (apiKey?: string) => {
    const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

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
