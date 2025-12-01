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
      API_GITHUB_ENDPOINTS: {
        authorize_link: string;
      };
      REGISTER_INIT_ENDPOINTS: {
        email_session: string;
        oauth_session: string;
        email: string;
        github: string;
      };
      AUTHENTICATION_ENDPOINTS: {
        register_email: string;
        register_oauth: string;
        login_email: string;
        login_oauth: string;
        refresh: string;
        logout: string;
        verify: string;
      };
    };
  }
}
