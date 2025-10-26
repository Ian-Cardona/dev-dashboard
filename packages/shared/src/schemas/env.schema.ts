import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'staging'])
    .default('development'),
  APP_NAME: z.string().default('DevDashboard'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.url().default('http://localhost:5173'),

  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),

  DYNAMODB_ENDPOINT: z.url().optional(),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .describe('Use a strong random string for production'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().int().positive().default(7),

  BCRYPT_SALT_ROUNDS_PW: z.coerce.number().int().min(8).max(15).default(12),
  BCRYPT_SALT_ROUNDS_RT: z.coerce.number().int().min(8).max(15).default(10),
  BCRYPT_SALT_ROUNDS_API_KEY: z.coerce
    .number()
    .int()
    .min(8)
    .max(15)
    .default(12),

  TODOS_TABLE: z.string().min(1).default('TODOS'),
  TODOS_RESOLUTIONS_TABLE: z.string().min(1).default('TODOS_RESOLUTION'),
  TODOS_CURRENT_TABLE: z.string().min(1).default('TODOS_CURRENT'),

  USERS_TABLE: z.string().min(1).default('USERS'),
  EMAILS_TABLE: z.string().min(1).default('EMAILS'),
  PROVIDERS_TABLE: z.string().min(1).default('PROVIDERS'),

  REFRESH_TOKENS_TABLE: z.string().min(1).default('REFRESH_TOKENS'),
  API_KEYS_TABLE: z.string().min(1).default('API_KEYS'),

  GITHUB_BASE_URL: z.string().default('https://api.github.com'),
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

  REDIS_URL: z.string().default('redis://localhost:6379/0'),

  CLIENT_APP_NAME: z.string().default('DevDashboardUI'),
});
