import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ApiKey } from '@dev-dashboard/shared';
import { IApiKeysModel } from './api-keys.model';
import { UnauthorizedError } from 'src/utils/errors.utils';

export interface IApiKeysService {
  create(
    userId: string,
    description: string
  ): Promise<{
    id: string;
    plainTextKey: string;
  }>;
  validate(plainTextKey: string): Promise<ApiKey>;
  // findById(id: string): Promise<ApiKey | null>;
  // findByUserId(userId: string): Promise<ApiKey[]>;
  // revoke(id: string): Promise<void>;
  // updateLastUsed(id: string, timestamp: string): Promise<ApiKey>;
}

const KEY_ID_PREFIX = 'key';
const KEY_SEPARATOR = '_';
const KEY_PREFIX = 'ddk';

export const ApiKeysService = (
  apiKeysModel: IApiKeysModel
): IApiKeysService => {
  const _generateKeys = async (): Promise<{
    id: string;
    plainTextKey: string;
    hashedKey: string;
  }> => {
    const keyId = `${KEY_ID_PREFIX}${KEY_SEPARATOR}${crypto.randomBytes(6).toString('hex')}`;
    const secret = crypto.randomBytes(32).toString('hex');

    const plainTextKey = `${KEY_PREFIX}${KEY_SEPARATOR}${keyId}${KEY_SEPARATOR}${secret}`;
    const hashedKey = await bcrypt.hash(plainTextKey, 12);

    return {
      id: keyId,
      plainTextKey,
      hashedKey,
    };
  };

  return {
    async create(
      userId: string,
      description: string
    ): Promise<{
      id: string;
      plainTextKey: string;
    }> {
      const { id, plainTextKey, hashedKey } = await _generateKeys();

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

      await apiKeysModel.create(key);

      return {
        id,
        plainTextKey,
      };
    },

    async validate(plainTextKey: string): Promise<ApiKey> {
      const parts = plainTextKey.split(KEY_SEPARATOR);
      if (parts.length < 3 || parts[0] !== KEY_PREFIX) {
        throw new UnauthorizedError('Invalid API key');
      }
      const keyId = parts[1];
      const apiKey = await apiKeysModel.findById(keyId);
      if (!apiKey) {
        throw new UnauthorizedError('Invalid API key');
      }
      if (!apiKey.isActive) {
        throw new UnauthorizedError('Invalid API key');
      }
      if (new Date(apiKey.expiresAt) < new Date()) {
        throw new UnauthorizedError('Invalid API key');
      }
      const isMatch = await bcrypt.compare(plainTextKey, apiKey.hash);
      if (!isMatch) {
        throw new UnauthorizedError('Invalid API key');
      }
      return apiKey;
    },

    // async findById(id: string): Promise<ApiKey | null> {
    //   // Implementation here
    // },

    // async findByUserId(userId: string): Promise<ApiKey[]> {
    //   // Implementation here
    // },

    // async revoke(id: string): Promise<void> {
    //   // Implementation here
    // },

    // async updateLastUsed(id: string, timestamp: string): Promise<ApiKey> {
    //   // Implementation here
    // },
  };
};
