import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ENV } from '../config/env_variables';
import { ApiKey } from '@dev-dashboard/shared';

const API_KEYS_TABLE = ENV.API_KEYS_TABLE;

export interface IApiKeysModel {
  create(key: ApiKey): Promise<ApiKey>;
  findById(id: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  revoke(id: string): Promise<void>;
  updateLastUsed(id: string, timestamp: string): Promise<ApiKey>;
}

export const ApiKeysModel: (
  docClient: DynamoDBDocumentClient
) => IApiKeysModel = docClient => {
  return {
    async create(data: ApiKey): Promise<ApiKey> {
      await docClient.send(
        new PutCommand({
          TableName: API_KEYS_TABLE,
          Item: data,
        })
      );
      return data;
    },

    findById: async (id: string) => {
      const result = await docClient.send(
        new GetCommand({
          TableName: API_KEYS_TABLE,
          Key: { id },
        })
      );

      return result.Item as ApiKey;
    },

    findByUserId: async (userId: string) => {
      const result = await docClient.send(
        new QueryCommand({
          TableName: API_KEYS_TABLE,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :u',
          ExpressionAttributeValues: {
            ':u': userId,
          },
        })
      );
      return result.Items as ApiKey[];
    },

    revoke: async (id: string) => {
      await docClient.send(
        new UpdateCommand({
          TableName: API_KEYS_TABLE,
          Key: { id },
          UpdateExpression: 'SET isActive = :isActive',
          ExpressionAttributeValues: {
            ':isActive': false,
          },
        })
      );
    },

    updateLastUsed: async () => {
      throw new Error('Not implemented');
    },
  };
};
