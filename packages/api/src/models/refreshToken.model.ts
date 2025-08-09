/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
  BatchWriteCommand,
  ScanCommandOutput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { RefreshToken } from '../types/refreshToken.type';
import { ENV } from '../config/env_variables';

const REFRESH_TOKEN_TABLE = ENV.REFRESH_TOKEN_TABLE;

export interface IRefreshTokenModel {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  findByUserAndToken(
    userId: string,
    tokenId: string
  ): Promise<RefreshToken | null>;
  deleteToken(userId: string, tokenId: string): Promise<void>;
  deleteAllUserTokens(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}

export const RefreshTokenModel = (docClient: DynamoDBDocumentClient) => {
  const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  return {
    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
      // Check both keys not exists to prevent overwrites (assumes composite key)
      await docClient.send(
        new PutCommand({
          TableName: REFRESH_TOKEN_TABLE,
          Item: refreshToken,
          ConditionExpression:
            'attribute_not_exists(userId) AND attribute_not_exists(tokenId)',
        })
      );
      return refreshToken;
    },

    async findByUserAndToken(
      userId: string,
      tokenId: string
    ): Promise<RefreshToken | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: REFRESH_TOKEN_TABLE,
          Key: { userId, tokenId },
        })
      );

      return result.Item ? (result.Item as RefreshToken) : null;
    },

    async deleteToken(userId: string, tokenId: string): Promise<void> {
      await docClient.send(
        new DeleteCommand({
          TableName: REFRESH_TOKEN_TABLE,
          Key: { userId, tokenId },
          ConditionExpression:
            'attribute_exists(userId) AND attribute_exists(tokenId)',
        })
      );
    },

    async deleteAllUserTokens(userId: string): Promise<void> {
      let ExclusiveStartKey: Record<string, any> | undefined = undefined;

      do {
        const queryResult: QueryCommandOutput = await docClient.send(
          new QueryCommand({
            TableName: REFRESH_TOKEN_TABLE,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId },
            ProjectionExpression: 'userId, tokenId',
            ExclusiveStartKey,
          })
        );

        if (!queryResult.Items || queryResult.Items.length === 0) {
          break;
        }

        const chunks = chunkArray(queryResult.Items, 25);

        for (const chunk of chunks) {
          const deleteRequests = chunk.map(item => ({
            DeleteRequest: {
              Key: { userId: item.userId, tokenId: item.tokenId },
            },
          }));

          const batchWriteParams = {
            RequestItems: {
              [REFRESH_TOKEN_TABLE]: deleteRequests,
            },
          };

          await docClient.send(new BatchWriteCommand(batchWriteParams));
        }
        ExclusiveStartKey = queryResult.LastEvaluatedKey;
      } while (ExclusiveStartKey);
    },

    async deleteExpiredTokens(): Promise<number> {
      let ExclusiveStartKey: Record<string, any> | undefined = undefined;
      const now = new Date().toISOString();
      let totalDeleted = 0;

      do {
        const scanResult: ScanCommandOutput = await docClient.send(
          new ScanCommand({
            TableName: REFRESH_TOKEN_TABLE,
            FilterExpression: 'expiresAt < :now',
            ExpressionAttributeValues: { ':now': now },
            ProjectionExpression: 'userId, tokenId',
            ExclusiveStartKey,
          })
        );

        if (!scanResult.Items || scanResult.Items.length === 0) {
          break;
        }

        const chunks = chunkArray(scanResult.Items, 25);

        for (const chunk of chunks) {
          const deleteRequests = chunk.map(item => ({
            DeleteRequest: {
              Key: { userId: item.userId, tokenId: item.tokenId },
            },
          }));

          const batchWriteParams = {
            RequestItems: {
              [REFRESH_TOKEN_TABLE]: deleteRequests,
            },
          };

          await docClient.send(new BatchWriteCommand(batchWriteParams));
          totalDeleted += chunk.length;
        }
        ExclusiveStartKey = scanResult.LastEvaluatedKey;
      } while (ExclusiveStartKey);

      return totalDeleted;
    },
  };
};
