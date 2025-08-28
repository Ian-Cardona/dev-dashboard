import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ApiKey } from '@dev-dashboard/shared';
import { IApiKeysModel } from './api-keys.model';

export interface IApiKeysService {
  create(
    userId: string,
    description: string
  ): Promise<{
    id: string;
    plainTextKey: string;
  }>;
  // findById(id: string): Promise<ApiKey | null>;
  // findByUserId(userId: string): Promise<ApiKey[]>;
  // revoke(id: string): Promise<void>;
  // updateLastUsed(id: string, timestamp: string): Promise<ApiKey>;
}

export const ApiKeysService = (
  apiKeysModel: IApiKeysModel
): IApiKeysService => {
  const _generateKeys = async (): Promise<{
    id: string;
    plainTextKey: string;
    hashedKey: string;
  }> => {
    const keyId = `key_${crypto.randomBytes(6).toString('hex')}`;
    const secret = crypto.randomBytes(32).toString('hex');

    const plainTextKey = `dvd_${keyId}_${secret}`;
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

      const key: ApiKey = {
        id: id,
        userId: userId,
        hash: hashedKey,
        createdAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
        description: description,
        isActive: true,
      };

      await apiKeysModel.create(key);

      return {
        id,
        plainTextKey,
      };
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
