import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { RefreshToken } from '../types/refreshToken.type';
import { REFRESH_TOKEN_TABLE } from '../constants/tables';

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
  return {
    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
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

      return result.Item as RefreshToken | null;
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
      const queryResult = await docClient.send(
        new QueryCommand({
          TableName: REFRESH_TOKEN_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ProjectionExpression: 'userId, tokenId',
        })
      );

      if (!queryResult.Items || queryResult.Items.length === 0) {
        return;
      }

      // Delete each token individually (DynamoDB doesn't support batch delete across partition keys)
      const deletePromises = queryResult.Items.map(item =>
        docClient.send(
          new DeleteCommand({
            TableName: REFRESH_TOKEN_TABLE,
            Key: { userId: item.userId, tokenId: item.tokenId },
          })
        )
      );

      await Promise.all(deletePromises);
    },

    async deleteExpiredTokens(): Promise<number> {
      const now = new Date().toISOString();

      const scanResult = await docClient.send(
        new ScanCommand({
          TableName: REFRESH_TOKEN_TABLE,
          FilterExpression: 'expiresAt < :now',
          ExpressionAttributeValues: { ':now': now },
          ProjectionExpression: 'userId, tokenId',
        })
      );

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return 0;
      }

      const deletePromises = scanResult.Items.map(item =>
        docClient.send(
          new DeleteCommand({
            TableName: REFRESH_TOKEN_TABLE,
            Key: { userId: item.userId, tokenId: item.tokenId },
          })
        )
      );

      await Promise.all(deletePromises);
      return scanResult.Items.length;
    },
  };
};
