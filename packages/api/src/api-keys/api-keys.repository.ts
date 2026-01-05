import { IApiKeysRepository } from './interfaces/iapi-keys.repository';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ApiKey, SafeApiKey } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

const API_KEYS_TABLE = ENV.API_KEYS_TABLE;

export const ApiKeysRepository = (
  docClient: DynamoDBDocumentClient
): IApiKeysRepository => {
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

    async findById(id: string): Promise<ApiKey | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: API_KEYS_TABLE,
          Key: { id },
        })
      );

      return result.Item as ApiKey;
    },

    async findByUserId(userId: string): Promise<SafeApiKey[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: API_KEYS_TABLE,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId',
          FilterExpression: '#isActive = :isActive',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':isActive': true,
          },
          ExpressionAttributeNames: {
            '#isActive': 'isActive',
          },
        })
      );

      if (!result.Items) {
        return [];
      }

      const safeResult: SafeApiKey[] = result.Items.map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        description: item.description,
      }));

      return safeResult;
    },

    async revoke(userId: string, id: string): Promise<void> {
      await docClient.send(
        new UpdateCommand({
          TableName: API_KEYS_TABLE,
          Key: { id },
          UpdateExpression: 'SET isActive = :isActive',
          ConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':isActive': false,
            ':userId': userId,
          },
        })
      );
    },
  };
};
