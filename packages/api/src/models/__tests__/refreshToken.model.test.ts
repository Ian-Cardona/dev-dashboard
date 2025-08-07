import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import { RefreshToken } from '../../types/refreshToken.type';
import { generateUUID, generateJWT } from '../../utils/uuid.utils';
import { RefreshTokenModel } from '../refreshToken.model';
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);
export const refreshTokenModel = RefreshTokenModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('RefreshToken Model', () => {
  let mockRefreshToken: RefreshToken;

  beforeEach(() => {
    ddbMock.reset();
    mockRefreshToken = {
      userId: generateUUID(),
      tokenId: generateUUID(),
      refreshToken: generateJWT({
        userId: generateUUID(),
        email: 'test@example.com',
      }),
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
  });

  describe('create', () => {
    it('should create a new refresh token securely using PutCommand', async () => {
      ddbMock.on(PutCommand).resolves({});
      const result = await refreshTokenModel.create(mockRefreshToken);
      expect(result).toEqual(mockRefreshToken);
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        Item: mockRefreshToken,
      });
    });

    it('should throw an error if PutCommand fails', async () => {
      ddbMock.on(PutCommand).rejects(new Error('PutCommand failed'));
      await expect(refreshTokenModel.create(mockRefreshToken)).rejects.toThrow(
        'PutCommand failed'
      );
    });
  });

  describe('findByUserAndToken', () => {
    it('should successfully find a refresh token by userId and tokenId and return it', async () => {
      ddbMock.on(GetCommand).resolves({
        Item: mockRefreshToken,
      });

      const result = await refreshTokenModel.findByUserAndToken(
        mockRefreshToken.userId,
        mockRefreshToken.tokenId
      );

      expect(result).toEqual(mockRefreshToken);
    });

    it('should return null when no refresh token is found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: null });

      const result = await refreshTokenModel.findByUserAndToken(
        'NONEXISTENT_USER',
        'NONEXISTENT_TOKEN'
      );

      expect(result).toBeNull();
    });

    it('should handle DynamoDB errors gracefully', async () => {
      ddbMock.on(GetCommand).rejects(new Error('DynamoDB error'));

      await expect(
        refreshTokenModel.findByUserAndToken(
          mockRefreshToken.userId,
          mockRefreshToken.tokenId
        )
      ).rejects.toThrow('DynamoDB error');
    });
  });

  describe('deleteToken', () => {
    it('should successfully delete a refresh token', async () => {
      ddbMock.on(DeleteCommand).resolves({});
      await expect(
        refreshTokenModel.deleteToken(
          mockRefreshToken.userId,
          mockRefreshToken.tokenId
        )
      ).resolves.not.toThrow();
    });

    it('should throw an error if DeleteCommand fails', async () => {
      ddbMock.on(DeleteCommand).rejects(new Error('DeleteCommand failed'));
      await expect(
        refreshTokenModel.deleteToken(
          mockRefreshToken.userId,
          mockRefreshToken.tokenId
        )
      ).rejects.toThrow('DeleteCommand failed');
    });
  });

  describe('deleteAllUserTokens', () => {
    it('should successfully delete all user tokens', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [mockRefreshToken],
      });
      ddbMock.on(BatchWriteCommand).resolves({});

      await expect(
        refreshTokenModel.deleteAllUserTokens(mockRefreshToken.userId)
      ).resolves.not.toThrow();
    });

    it('should return empty if no tokens are found', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [],
      });
      await expect(
        refreshTokenModel.deleteAllUserTokens(mockRefreshToken.userId)
      ).resolves.not.toThrow();
    });

    it('should throw an error if QueryCommand fails', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('QueryCommand failed'));
      await expect(
        refreshTokenModel.deleteAllUserTokens(mockRefreshToken.userId)
      ).rejects.toThrow('QueryCommand failed');
    });

    it('should throw an error if BatchWriteCommand fails', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [mockRefreshToken],
      });
      ddbMock
        .on(BatchWriteCommand)
        .rejects(new Error('BatchWriteCommand failed'));

      await expect(
        refreshTokenModel.deleteAllUserTokens(mockRefreshToken.userId)
      ).rejects.toThrow('BatchWriteCommand failed');
    });
  });

  describe('deleteExpiredTokens', () => {
    it('should successfully delete expired tokens', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [mockRefreshToken],
      });
      ddbMock.on(BatchWriteCommand).resolves({});

      await expect(
        refreshTokenModel.deleteExpiredTokens()
      ).resolves.not.toThrow();
    });

    it('should return empty if no expired tokens are found', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [],
      });
      await expect(
        refreshTokenModel.deleteExpiredTokens()
      ).resolves.not.toThrow();
    });

    it('should throw an error if ScanCommand fails', async () => {
      ddbMock.on(ScanCommand).rejects(new Error('ScanCommand failed'));
      await expect(refreshTokenModel.deleteExpiredTokens()).rejects.toThrow(
        'ScanCommand failed'
      );
    });

    it('should throw an error if BatchWriteCommand fails', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [mockRefreshToken],
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
