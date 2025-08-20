import type { AuthenticationSuccessResponse } from '../../../shared/types/auth.type';

export const auth = {
  refresh: async ({
    signal,
    userId,
  }: {
    signal?: AbortSignal;
    userId?: string;
  } = {}): Promise<AuthenticationSuccessResponse> => {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      throw res;
    }

    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      throw new Error('Invalid response format from refresh endpoint');
    }

    return res.json() as Promise<AuthenticationSuccessResponse>;
  },
};
