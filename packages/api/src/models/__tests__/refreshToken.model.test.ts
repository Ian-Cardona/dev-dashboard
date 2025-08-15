import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  BatchWriteCommand,
  ScanCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { RefreshTokenModel } from '../refreshToken.model';
import { generateUUID } from '../../utils/uuid.utils';
import { ENV } from '../../config/env_variables';

vi.mock('../../config/env_variables', () => ({
  ENV: {
    REFRESH_TOKEN_TABLE: 'refresh-tokens-test-table',
  },
}));

const ddbMock = mockClient(DynamoDBDocumentClient);
const refreshTokenModel = RefreshTokenModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('RefreshTokenModel', () => {
  const MOCK_USER_ID = generateUUID();
  const MOCK_TOKEN_ID = generateUUID();
  let mockRefreshToken;

  beforeEach(() => {
    ddbMock.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-15T21:00:00.000Z'));

    mockRefreshToken = {
      userId: MOCK_USER_ID,
      refreshTokenId: MOCK_TOKEN_ID,
      refreshTokenHash: generateUUID(),
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      revoked: false,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('should successfully create a refresh token with correct conditions', async () => {
      ddbMock.on(PutCommand).resolves({});
      const result = await refreshTokenModel.create(mockRefreshToken);

      expect(result).toEqual(mockRefreshToken);
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: ENV.REFRESH_TOKEN_TABLE,
        Item: mockRefreshToken,
        ConditionExpression:
          'attribute_not_exists(userId) AND attribute_not_exists(refreshTokenId)',
      });
    });

    it('should throw if conditional put fails due to existing token', async () => {
      ddbMock
        .on(PutCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });

      await expect(
        refreshTokenModel.create(mockRefreshToken)
      ).rejects.toHaveProperty('name', 'ConditionalCheckFailedException');
    });
  });

  describe('findByUserId', () => {
    it('should return refresh tokens array when tokens found by userId', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [mockRefreshToken] });
      const result = await refreshTokenModel.findByUserId(MOCK_USER_ID);

      expect(result).toEqual([mockRefreshToken]);
      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: ENV.REFRESH_TOKEN_TABLE,
        KeyConditionExpression: 'userId = :uuid',
        ExpressionAttributeValues: { ':uuid': MOCK_USER_ID },
      });
    });

    it('should return empty array when no tokens found for user', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });
      const result = await refreshTokenModel.findByUserId(
        'nonexistent-user-id'
      );

      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('QueryCommand failed'));

      await expect(
        refreshTokenModel.findByUserId(MOCK_USER_ID)
      ).rejects.toThrow('QueryCommand failed');
    });
  });

  describe('deleteToken', () => {
    it('should successfully delete a refresh token', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await expect(
        refreshTokenModel.deleteToken(MOCK_USER_ID, MOCK_TOKEN_ID)
      ).resolves.toBeUndefined();

      expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
        TableName: ENV.REFRESH_TOKEN_TABLE,
        Key: { userId: MOCK_USER_ID, refreshTokenId: MOCK_TOKEN_ID },
        ConditionExpression:
          'attribute_exists(userId) AND attribute_exists(refreshTokenId)',
      });
    });

    it('should throw if trying to delete non-existing token', async () => {
      ddbMock
        .on(DeleteCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });

      await expect(
        refreshTokenModel.deleteToken(MOCK_USER_ID, MOCK_TOKEN_ID)
      ).rejects.toHaveProperty('name', 'ConditionalCheckFailedException');
    });
  });

  describe('deleteAllUserTokens', () => {
    it('should delete all tokens for a user in batches', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [{ userId: MOCK_USER_ID, refreshTokenId: MOCK_TOKEN_ID }],
        LastEvaluatedKey: undefined,
      });
      ddbMock.on(BatchWriteCommand).resolves({});

      await expect(
        refreshTokenModel.deleteAllUserTokens(MOCK_USER_ID)
      ).resolves.toBeUndefined();

      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: ENV.REFRESH_TOKEN_TABLE,
        KeyConditionExpression: 'userId = :uuid',
        ExpressionAttributeValues: { ':uuid': MOCK_USER_ID },
        ProjectionExpression: 'userId, refreshTokenId',
      });

      expect(ddbMock).toHaveReceivedCommandWith(BatchWriteCommand, {
        RequestItems: {
          [ENV.REFRESH_TOKEN_TABLE]: [
            {
              DeleteRequest: {
                Key: {
                  userId: MOCK_USER_ID,
                  refreshTokenId: MOCK_TOKEN_ID,
                },
              },
            },
          ],
        },
      });
    });

    it('should handle no tokens found gracefully', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });

      await expect(
        refreshTokenModel.deleteAllUserTokens(MOCK_USER_ID)
      ).resolves.toBeUndefined();
    });

    it('should throw if query command fails', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('QueryCommand failed'));

      await expect(
        refreshTokenModel.deleteAllUserTokens(MOCK_USER_ID)
      ).rejects.toThrow('QueryCommand failed');
    });

    it('should throw if batch write command fails', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [{ userId: MOCK_USER_ID, refreshTokenId: MOCK_TOKEN_ID }],
      });
      ddbMock
        .on(BatchWriteCommand)
        .rejects(new Error('BatchWriteCommand failed'));

      await expect(
        refreshTokenModel.deleteAllUserTokens(MOCK_USER_ID)
      ).rejects.toThrow('BatchWriteCommand failed');
    });
  });

  describe('deleteExpiredTokens', () => {
    it('should delete expired tokens in batches and return count', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [{ userId: MOCK_USER_ID, refreshTokenId: MOCK_TOKEN_ID }],
        LastEvaluatedKey: undefined,
      });
      ddbMock.on(BatchWriteCommand).resolves({});

      const deletedCount = await refreshTokenModel.deleteExpiredTokens();

      expect(deletedCount).toBe(1);
      expect(ddbMock).toHaveReceivedCommandWith(ScanCommand, {
        TableName: ENV.REFRESH_TOKEN_TABLE,
        FilterExpression: 'expiresAt < :now',
        ExpressionAttributeValues: {
          ':now': new Date().toISOString(),
        },
        ProjectionExpression: 'userId, refreshTokenId',
      });
    });

    it('should return 0 if no expired tokens found', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [] });
      const deletedCount = await refreshTokenModel.deleteExpiredTokens();

      expect(deletedCount).toBe(0);
    });

    it('should throw if scan command fails', async () => {
      ddbMock.on(ScanCommand).rejects(new Error('ScanCommand failed'));

      await expect(refreshTokenModel.deleteExpiredTokens()).rejects.toThrow(
        'ScanCommand failed'
      );
    });

    it('should throw if batch write command fails', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [{ userId: MOCK_USER_ID, refreshTokenId: MOCK_TOKEN_ID }],
      });
      ddbMock
        .on(BatchWriteCommand)
        .rejects(new Error('BatchWriteCommand failed'));

      await expect(refreshTokenModel.deleteExpiredTokens()).rejects.toThrow(
        'BatchWriteCommand failed'
      );
    });
  });
});
