import { config } from 'dotenv';
import { resolve } from 'path';
import { beforeAll } from 'vitest';

config({ path: resolve(__dirname, '../.env.test') });

beforeAll(() => {
  console.log('Setup complete');
});
