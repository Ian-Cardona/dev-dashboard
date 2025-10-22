import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue';
import { useState, useEffect } from 'react';

//TODO: Add this to env
const OAUTH_ERROR_COOKIE_KEY = 'gh_o_e';

const OAUTH_ERROR_MESSAGES: { [key: string]: string } = {
  invalid_state:
    'Your session has expired or is invalid. Please try signing up again.',
  oauth_failed: 'Authentication with GitHub failed. Please try again.',
  conflict:
    'This GitHub account is already linked to an existing user. Please log in.',
  user_not_found:
    'This GitHub account is not registered. Please complete the sign-up.',
  default: 'An unknown error occurred during GitHub sign-up. Please try again.',
};

export const useOAuthErrorFromCookie = (): string | null => {
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const errorCode = getAndClearCookieValue(OAUTH_ERROR_COOKIE_KEY);

    if (errorCode) {
      const friendlyMessage =
        OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES.default;
      setOauthError(friendlyMessage);
    }
  }, []);

  return oauthError;
};
