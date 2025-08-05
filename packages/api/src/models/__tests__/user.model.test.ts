import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';

import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserModel } from '../user.model';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import { User } from '../../types/user.type';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

// Mock user data
const mockUser: User = {
  userId: 'TEST_USER12345',
  email: 'test@example.com',
  passwordHash: 'a'.repeat(VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH),
  createdAt: '2025-07-31T14:42:05.000Z',
  updatedAt: '2025-07-31T14:42:05.000Z',
  isActive: true,
};

const ddbMock = mockClient(DynamoDBDocumentClient);

// Create user model instance with mocked client
export const userModel = UserModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('User Model', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('successfully creates user', async () => {
      ddbMock.on(PutCommand).resolves({});
      const result = await userModel.create(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('throws when user exists', async () => {
      ddbMock
        .on(PutCommand)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .rejects(new ConditionalCheckFailedException({ $metadata: {} } as any));

      await expect(userModel.create(mockUser)).rejects.toBeInstanceOf(
        ConditionalCheckFailedException
      );
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(PutCommand).rejects(new Error('DB error'));
      await expect(userModel.create(mockUser)).rejects.toThrow('DB error');
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: mockUser });
      const result = await userModel.findById(mockUser.userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      ddbMock.on(GetCommand).resolves({});

      const result = await userModel.findById('UNKNOWN_ID');
      expect(result).toBeNull();
    });

    it('should return null when Item is explicitly null', async () => {
      ddbMock.on(GetCommand).resolves({ Item: null });

      const result = await userModel.findById('NULL_ID');
      expect(result).toBeNull();
    });

    it('should handle DynamoDB errors', async () => {
      ddbMock.on(GetCommand).rejects(new Error('DB error'));
      await expect(userModel.findById('TEST')).rejects.toThrow('DB error');
    });
  });

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [mockUser],
        Count: 1,
        ScannedCount: 1,
      });

      const result = await userModel.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('returns null when not found', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [],
        Count: 0,
        ScannedCount: 0,
      });

      const result = await userModel.findByEmail('unknown@example.com');
      expect(result).toBeNull();
    });

    it('returns null for empty response', async () => {
      ddbMock.on(QueryCommand).resolves({});
      const result = await userModel.findByEmail('test@example.com');
      expect(result).toBeNull();
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('DB error'));

      await expect(userModel.findByEmail('test@example.com')).rejects.toThrow(
        'DB error'
      );
    });
  });
});
