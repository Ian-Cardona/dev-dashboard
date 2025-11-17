declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL: string;
      CLIENT_APP_NAME: string;
      ENVIRONMENT: string;
      OAUTH_SUCCESS_COOKIE_KEYS: {
        provider: string;
        id: string;
        login: string;
        enc: string;
      };
      OAUTH_ERROR_COOKIE_KEYS: {
        error: string;
      };
      REG_INIT_COOKIE_KEYS: {
        registration_token: string;
        registration_id: string;
      };
    };
  }
}

const getConfig = () => {
  if (!window.__APP_CONFIG__) {
    console.error('App config not loaded!');
    return {
      API_URL: 'http://localhost:3000/v1',
      CLIENT_APP_NAME: 'DevDashboardUI',
      ENVIRONMENT: 'development',
      OAUTH_SUCCESS_COOKIE_KEYS: {
        provider: 'gh_o_p',
        id: 'gh_o_i',
        login: 'gh_o_l',
        enc: 'gh_o_enc',
      },
      OAUTH_ERROR_COOKIE_KEYS: {
        error: 'gh_o_e',
      },
      REG_INIT_COOKIE_KEYS: {
        registration_token: 'regintkn',
        registration_id: 'reginid',
      },
    };
  }
  return window.__APP_CONFIG__;
};

export const config = getConfig();

export const getApiUrl = () => config.API_URL;
export const getClientAppName = () => config.CLIENT_APP_NAME;
export const getEnvironment = () => config.ENVIRONMENT;
export const isProduction = () => config.ENVIRONMENT === 'production';

export const getOAuthSuccessCookieKeys = () => config.OAUTH_SUCCESS_COOKIE_KEYS;
export const getOAuthErrorCookieKeys = () => config.OAUTH_ERROR_COOKIE_KEYS;
export const getRegInitCookieKeys = () => config.REG_INIT_COOKIE_KEYS;
