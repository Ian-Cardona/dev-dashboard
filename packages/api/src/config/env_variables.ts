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
  // Tables
  CODE_TASK_TABLE: process.env.CODE_TASK_TABLE || 'CodeTasks',
  USER_TABLE: process.env.USER_TABLE || 'Users',
  EMAIL_TABLE: process.env.EMAIL_TABLE || 'Emails',
  REFRESH_TOKEN_TABLE: process.env.REFRESH_TOKEN_TABLE || 'RefreshTokens',
  // Audience
  CLIENT_APP_NAME: process.env.CLIENT_APP_NAME || 'DevDashboardUI',
};
