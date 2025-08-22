/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
  ScanCommandOutput,
  QueryCommandOutput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { RefreshToken } from '../../../shared/types/refreshToken.type';
import { ENV } from '../config/env_variables';

const REFRESH_TOKEN_TABLE = ENV.REFRESH_TOKEN_TABLE;
const BATCH_CHUNK_SIZE = 25;

export interface IRefreshTokenModel {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  // findByUserId(userId: string): Promise<RefreshToken[] | null>;
  findById(id: string): Promise<RefreshToken | null>;
  tombstoneToken(refreshToken: RefreshToken): Promise<void>;
  deleteAllUserTokens(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}

export const RefreshTokenModel = (docClient: DynamoDBDocumentClient) => {
  const processBatch = async (items: Array<Record<string, any>>) => {
    const chunks = [];
    for (let i = 0; i < items.length; i += BATCH_CHUNK_SIZE) {
      chunks.push(items.slice(i, i + BATCH_CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [REFRESH_TOKEN_TABLE]: chunk.map(item => ({
              DeleteRequest: {
                Key: {
                  userId: item.userId,
                  refreshTokenId: item.refreshTokenId,
                },
              },
            })),
          },
        })
      );
    }
  };

  return {
    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
      await docClient.send(
        new PutCommand({
          TableName: REFRESH_TOKEN_TABLE,
          Item: refreshToken,
          ConditionExpression:
            'attribute_not_exists(userId) AND attribute_not_exists(refreshTokenId)',
        })
      );
      return refreshToken;
    },

    async findById(id: string): Promise<RefreshToken | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: REFRESH_TOKEN_TABLE,
          KeyConditionExpression: 'refreshTokenId = :refreshTokenId',
          ExpressionAttributeValues: {
            ':refreshTokenId': id,
          },
        })
      );

      return (result.Items as RefreshToken[])?.[0] || null;
    },

    // async findByUserId(userId: string): Promise<RefreshToken[] | null> {
    //   const result = await docClient.send(
    //     new QueryCommand({
    //       TableName: REFRESH_TOKEN_TABLE,
    //       KeyConditionExpression: 'userId = :userId',
    //       ExpressionAttributeValues: {
    //         ':userId': userId,
    //       },
    //     })
    //   );

    //   return (result.Items as RefreshToken[]) || [];
    // },

    // async findByToken(refreshToken: string): Promise<RefreshToken | null> {
    //   const result = await docClient.send(
    //     new QueryCommand({
    //       TableName: REFRESH_TOKEN_TABLE,
    //       IndexName: 'RefreshTokenGSI',
    //       KeyConditionExpression: 'refreshToken = :token',
    //       ExpressionAttributeValues: {
    //         ':token': refreshToken,
    //       },
    //     })
    //   );

    //   return (result.Items as RefreshToken[])?.[0] || null;
    // },

    // async deleteToken(userId: string, refreshTokenId: string): Promise<void> {
    //   await docClient.send(
    //     new DeleteCommand({
    //       TableName: REFRESH_TOKEN_TABLE,
    //       Key: { userId, refreshTokenId },
    //       ConditionExpression:
    //         'attribute_exists(userId) AND attribute_exists(refreshTokenId)',
    //     })
    //   );
    // },

    async tombstoneToken(refreshToken: RefreshToken): Promise<void> {
      await docClient.send(
        new UpdateCommand({
          TableName: REFRESH_TOKEN_TABLE,
          Key: {
            userId: refreshToken.userId,
            refreshTokenId: refreshToken.refreshTokenId,
          },
          UpdateExpression: 'SET revoked = :revoked, revokedAt = :revokedAt',
          ConditionExpression:
            'attribute_exists(userId) AND attribute_exists(refreshTokenId) AND (attribute_not_exists(revoked) OR revoked = :false)',
          ExpressionAttributeValues: {
            ':revoked': refreshToken.revoked,
            ':revokedAt': refreshToken.revokedAt,
            ':false': false,
          },
        })
      );
    },

    async deleteAllUserTokens(userId: string): Promise<void> {
      let ExclusiveStartKey: Record<string, any> | undefined;

      do {
        const queryResult: QueryCommandOutput = await docClient.send(
          new QueryCommand({
            TableName: REFRESH_TOKEN_TABLE,
            KeyConditionExpression: 'userId = :uuid',
            ExpressionAttributeValues: { ':uuid': userId },
            ProjectionExpression: 'userId, refreshTokenId',
            ExclusiveStartKey,
          })
        );

        if (!queryResult.Items?.length) break;

        await processBatch(queryResult.Items);
        ExclusiveStartKey = queryResult.LastEvaluatedKey;
      } while (ExclusiveStartKey);
    },

    async deleteExpiredTokens(): Promise<number> {
      let ExclusiveStartKey: Record<string, any> | undefined;
      const now = new Date().toISOString();
      let totalDeleted = 0;

      do {
        const scanResult: ScanCommandOutput = await docClient.send(
          new ScanCommand({
            TableName: REFRESH_TOKEN_TABLE,
            FilterExpression: 'expiresAt < :now',
            ExpressionAttributeValues: { ':now': now },
            ProjectionExpression: 'userId, refreshTokenId',
            ExclusiveStartKey,
          })
        );

        if (!scanResult.Items?.length) break;

        await processBatch(scanResult.Items);
        totalDeleted += scanResult.Items.length;
        ExclusiveStartKey = scanResult.LastEvaluatedKey;
      } while (ExclusiveStartKey);

      return totalDeleted;
    },
  };
};
