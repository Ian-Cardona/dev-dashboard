window.__APP_CONFIG__ = {
  API_URL: 'https://api.devdashboard.app/v1',
  CLIENT_APP_NAME: 'DevDashboardApp',
  ENVIRONMENT: 'production',
  OAUTH_SUCCESS_COOKIE_KEYS: {
    provider: 'gh_o_p',
    id: 'gh_o_i',
    login: 'gh_o_l',
    enc: 'gh_o_enc',
  },
  OAUTH_ERROR_COOKIE_KEYS: {
    error: 'gh_o_e',
  },
  OAUTH_LINK_COOKIE_KEYS: {
    error: 'gh_o_e',
    success: 'gh_o_s',
  },
  REG_INIT_COOKIE_KEYS: {
    registration_token: 'regintkn',
    registration_id: 'reginid',
  },
  API_GITHUB_ENDPOINTS: {
    authorize_link: 'github/authorize/link',
  },
  REGISTER_INIT_ENDPOINTS: {
    email_session: '/init/email/session',
    oauth_session: '/init/oauth/session',
    email: '/init/email',
    github: '/init/github',
  },
  AUTHENTICATION_ENDPOINTS: {
    register_email: '/auth/register/email',
    register_oauth: '/auth/register/oauth',
    login_email: '/auth/login/email',
    login_oauth: '/auth/login/oauth',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    verify: '/auth/verify',
  },
};
