import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ENV } from '../config/env_variables';

const API_KEYS_TABLE = ENV.API_KEYS_TABLE;

export interface IApiKeyModel {
  create(data: ApiKey): Promise<ApiKey>;
  findById(id: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  revoke(id: string): Promise<void>;
  updateLastUsed(id: string, timestamp: string): Promise<ApiKey>;
}

export const ApiKeyModel: (
  docClient: DynamoDBDocumentClient
) => IApiKeyModel = docClient => {
  return {
    async create(data: ApiKey): ReturnType<IApiKeyModel['create']> {
      await docClient.send(
        new PutCommand({
          TableName: API_KEYS_TABLE,
          Item: data,
        })
      );
      return data;
    },

    findById: async () => {
      throw new Error('Not implemented');
    },
    findByUserId: async () => {
      throw new Error('Not implemented');
    },
    revoke: async () => {
      throw new Error('Not implemented');
    },
    updateLastUsed: async () => {
      throw new Error('Not implemented');
    },
  };
};
