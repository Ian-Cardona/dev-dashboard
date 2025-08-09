export const ENV = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // AWS
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  // Bcrypt
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 12,
  // Refresh Token
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  // Tables
  CODE_TASK_TABLE: process.env.CODE_TASK_TABLE || 'CodeTask',
  USER_TABLE: process.env.USER_TABLE || 'User',
  EMAIL_TABLE: process.env.EMAIL_TABLE || 'Email',
  REFRESH_TOKEN_TABLE: process.env.REFRESH_TOKEN_TABLE || 'RefreshToken',
};
