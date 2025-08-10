export const ENV = {
  // Environment
  APP_NAME: process.env.APP_NAME || 'DevDashboard',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // AWS
  AWS_REGION: process.env.AWS_REGION || 'sa-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'aws_access_key_id',
  AWS_SECRET_ACCESS_KEY:
    process.env.AWS_SECRET_ACCESS_KEY || 'aws_secret_access_key',
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'you-will-never-guess',
  JWT_EXPIRES_IN_SECONDS: process.env.JWT_EXPIRES_IN_SECONDS || '900',
  // Bcrypt
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 12,
  // Tables
  CODE_TASK_TABLE: process.env.CODE_TASK_TABLE || 'CodeTask',
  USER_TABLE: process.env.USER_TABLE || 'User',
  EMAIL_TABLE: process.env.EMAIL_TABLE || 'Email',
  REFRESH_TOKEN_TABLE: process.env.REFRESH_TOKEN_TABLE || 'RefreshToken',
};
