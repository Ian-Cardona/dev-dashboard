import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'staging'])
    .default('development'),
  APP_NAME: z.string().default('DevDashboard'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.url(),

  ENCRYPTION_KEY: z
    .string()
    .length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_DYNAMODB_ENDPOINT: z.url().optional(),

  BCRYPT_SALT_ROUNDS_PW: z.coerce.number().int().min(8).max(15).default(12),
  BCRYPT_SALT_ROUNDS_RT: z.coerce.number().int().min(8).max(15).default(10),
  BCRYPT_SALT_ROUNDS_GH_AC: z.coerce.number().int().min(8).max(15).default(10),
  BCRYPT_SALT_ROUNDS_API_KEY: z.coerce
    .number()
    .int()
    .min(8)
    .max(15)
    .default(11),

  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().int().positive().default(7),

  TODOS_TABLE: z.string().min(1).default('TODOS'),
  TODOS_RESOLUTIONS_TABLE: z.string().min(1).default('TODOS_RESOLUTION'),
  TODOS_CURRENT_TABLE: z.string().min(1).default('TODOS_CURRENT'),
  USERS_TABLE: z.string().min(1).default('USERS'),
  EMAILS_TABLE: z.string().min(1).default('EMAILS'),
  PROVIDERS_TABLE: z.string().min(1).default('PROVIDERS'),
  REFRESH_TOKENS_TABLE: z.string().min(1).default('REFRESH_TOKENS'),
  API_KEYS_TABLE: z.string().min(1).default('API_KEYS'),

  GITHUB_BASE_URL: z.url().default('https://api.github.com'),
  GITHUB_OAUTH_CLIENT_ID: z
    .string()
    .min(1, 'GITHUB_OAUTH_CLIENT_ID is required'),
  GITHUB_OAUTH_CLIENT_SECRET: z
    .string()
    .min(1, 'GITHUB_OAUTH_CLIENT_SECRET is required'),
  GITHUB_OAUTH_REDIRECT_URI: z.url(
    'GITHUB_OAUTH_REDIRECT_URI must be a valid URL'
  ),
  GITHUB_OAUTH_ACCESS_TOKEN_URI: z
    .url()
    .default('https://github.com/login/oauth/access_token'),
  GITHUB_OAUTH_AUTHORIZE_URI: z
    .url()
    .default('https://github.com/login/oauth/authorize'),
  GITHUB_SCOPE: z.string().default('read:user repo workflow read:org'),

  REDIS_URL: z.url().default('redis://localhost:6379/0'),

  CLIENT_APP_NAME: z.string().default('DevDashboardApp'),
});
