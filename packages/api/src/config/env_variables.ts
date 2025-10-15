export const ENV = {
  // Environment
  APP_NAME: process.env.APP_NAME || 'DevDashboard',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // AWS
  AWS_REGION: process.env.AWS_REGION || 'ap-southeast-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'fake',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'fake',
  // DYNAMODB
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'you-will-never-guess',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  // REFRESH_TOKEN
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || 7,
  // Bcrypt
  BCRYPT_SALT_ROUNDS_PW: process.env.BCRYPT_SALT_ROUNDS_PW || 12,
  BCRYPT_SALT_ROUNDS_RT: process.env.BCRYPT_SALT_ROUNDS_RT || 10,
  BCRYPT_SALT_ROUNDS_API_KEY: process.env.BCRYPT_SALT_ROUNDS_API_KEY || 12,

  // Todo Related Tables
  TODO_BATCHES_TABLE: process.env.TODOS_TABLE || 'TODOS',
  TODO_RESOLUTIONS_TABLE:
    process.env.TODOS_RESOLUTIONS_TABLE || 'TODOS_RESOLUTION',
  TODO_CURRENT_TABLE: process.env.TODOS_CURRENT_TABLE || 'TODOS_CURRENT',

  // Users Related Tables
  USERS_TABLE: process.env.USERS_TABLE || 'USERS',
  EMAILS_TABLE: process.env.EMAILS_TABLE || 'EMAILS',
  PROVIDERS_TABLE: process.env.PROVIDERS_TABLE || 'PROVIDERS',

  // Token Related Tables
  REFRESH_TOKENS_TABLE: process.env.REFRESH_TOKENS_TABLE || 'REFRESH_TOKENS',
  API_KEYS_TABLE: process.env.API_KEYS_TABLE || 'API_KEYS',
  // Audience
  CLIENT_APP_NAME: process.env.CLIENT_APP_NAME || 'DevDashboardUI',

  // Github
  GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID || 'DrainGang',
  GITHUB_OAUTH_CLIENT_SECRET:
    process.env.GITHUB_OAUTH_CLIENT_SECRET || 'DrainGang',
  GITHUB_OAUTH_REDIRECT_URI:
    process.env.GITHUB_OAUTH_REDIRECT_URI ||
    'http://localhost:3000/v1/github/oauth/callback',
  GITHUB_OAUTH_ACCESS_TOKEN_URI:
    process.env.GITHUB_OAUTH_ACCESS_TOKEN_URI ||
    'https://github.com/login/oauth/access_token',
  GITHUB_OAUTH_AUTHORIZE_URI:
    process.env.GITHUB_OAUTH_AUTHORIZE_URI ||
    'https://github.com/login/oauth/authorize',
};
