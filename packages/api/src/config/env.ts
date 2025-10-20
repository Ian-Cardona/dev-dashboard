import { Environment, envSchema } from '@dev-dashboard/shared';
import { z } from 'zod';

let parsedEnv: Environment | null = null;

export const getEnv = (): Environment => {
  if (parsedEnv) return parsedEnv;

  try {
    parsedEnv = envSchema.parse(process.env);
    return parsedEnv;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.issues.forEach(issue => {
        console.error(`  ${issue.path.join('.')}: ${issue.message}`);
      });
      process.exit(1);
    }

    if (error instanceof Error) {
      console.error('Failed to load environment:', error.message);
    } else {
      console.error('Failed to load environment:', error);
    }

    process.exit(1);
  }
};

export const ENV = getEnv();
