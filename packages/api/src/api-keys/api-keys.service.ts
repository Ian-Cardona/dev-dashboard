import { IApiKeysRepository } from './interfaces/iapi-keys.repository';
import { IApiKeysService } from './interfaces/iapi-keys.service';
import { ApiKey, ApiKeyPublic, SafeApiKey } from '@dev-dashboard/shared';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ENV } from 'src/config/env';
import { UnauthorizedError } from 'src/utils/errors.utils';

const KEY_ID_PREFIX = 'key';
const KEY_SEPARATOR = '_';
const KEY_PREFIX = 'ddk';

export const ApiKeysService = (
  apiKeysRepository: IApiKeysRepository
): IApiKeysService => {
  const _preHashIfNeeded = (key: string): string => {
    const byteLength = Buffer.byteLength(key, 'utf8');
    if (byteLength > 72) {
      return crypto.createHash('sha256').update(key, 'utf8').digest('hex');
    }
    return key;
  };

  const _generateKeys = async (): Promise<{
    id: string;
    pkey: string;
    hashedKey: string;
  }> => {
    const keyId = `${KEY_ID_PREFIX}${KEY_SEPARATOR}${crypto.randomBytes(4).toString('hex')}`;
    const secret = crypto.randomBytes(24).toString('hex');

    const pkey = `${KEY_PREFIX}${KEY_SEPARATOR}${keyId}${KEY_SEPARATOR}${secret}`;

    const keyToHash = _preHashIfNeeded(pkey);
    const hashedKey = await bcrypt.hash(
      keyToHash,
      Number(ENV.BCRYPT_SALT_ROUNDS_API_KEY)
    );

    return {
      id: keyId,
      pkey,
      hashedKey,
    };
  };

  return {
    async create(userId: string, description: string): Promise<ApiKeyPublic> {
      const { id, pkey, hashedKey } = await _generateKeys();

      const createdAt = new Date();
      const expiresAt = new Date(
        createdAt.getTime() + 90 * 24 * 60 * 60 * 1000
      );
      const key: ApiKey = {
        id: id,
        userId: userId,
        hash: hashedKey,
        createdAt: createdAt.toISOString(),
        lastUsedAt: createdAt.toISOString(),
        description: description,
        expiresAt: expiresAt.toISOString(),
        isActive: true,
      };

      await apiKeysRepository.create(key);

      return {
        id,
        pkey,
      };
    },

    async validate(pkey: string): Promise<ApiKey> {
      const byteLength = Buffer.byteLength(pkey, 'utf8');

      if (byteLength > 72) {
        throw new UnauthorizedError('Invalid API key');
      }

      const parts = pkey.split(KEY_SEPARATOR);
      if (
        parts.length !== 4 ||
        parts[0] !== KEY_PREFIX ||
        parts[1] !== KEY_ID_PREFIX
      ) {
        throw new UnauthorizedError('Invalid API key');
      }
      const keyId = `${parts[1]}${KEY_SEPARATOR}${parts[2]}`;

      const apiKey = await apiKeysRepository.findById(keyId);

      if (!apiKey) {
        throw new UnauthorizedError('Invalid API key');
      }
      if (!apiKey.isActive) {
        throw new UnauthorizedError('Invalid API key');
      }
      if (new Date(apiKey.expiresAt) < new Date()) {
        throw new UnauthorizedError('Invalid API key');
      }

      const keyToCompare = _preHashIfNeeded(pkey);
      const isMatch = await bcrypt.compare(keyToCompare, apiKey.hash);

      if (!isMatch) {
        throw new UnauthorizedError('Invalid API key');
      }

      return apiKey;
    },

    async findByUserId(userId: string): Promise<SafeApiKey[]> {
      try {
        return apiKeysRepository.findByUserId(userId);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to retrieve API keys');
      }
    },

    async revoke(userId: string, id: string): Promise<void> {
      await apiKeysRepository.revoke(userId, id);
    },
  };
};
