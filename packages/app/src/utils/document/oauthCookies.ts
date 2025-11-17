import {
  getOAuthErrorCookieKeys,
  getOAuthSuccessCookieKeys,
  getRegInitCookieKeys,
} from '../configs/envConfig';

export const OAUTH_SUCCESS_COOKIE_KEYS = getOAuthSuccessCookieKeys();
export const OAUTH_ERROR_COOKIE_KEYS = getOAuthErrorCookieKeys();
export const REG_INIT_COOKIE_KEYS = getRegInitCookieKeys();
