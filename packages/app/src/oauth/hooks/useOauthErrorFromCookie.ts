import { getOAuthErrorCookieKeys } from '../../lib/configs/getConfig';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue';
import { useEffect, useState } from 'react';

const OAUTH_ERROR_MESSAGES: { [key: string]: string } = {
  conflict: 'User already exists. Please log in instead.',
  oauth_failed: 'Authentication with GitHub failed. Please try again.',
  user_not_found:
    'This GitHub account is not registered. Please sign up first.',
  default: 'An unknown error occurred during sign in. Please try again.',
};

export const useOAuthErrorFromCookie = (): string | null => {
  const oauthErrorCookieKeys = getOAuthErrorCookieKeys();
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const errorCode = getAndClearCookieValue(oauthErrorCookieKeys.error);

    if (errorCode) {
      const message =
        OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES.default;
      setOauthError(message);
    }
  }, []);

  return oauthError;
};
