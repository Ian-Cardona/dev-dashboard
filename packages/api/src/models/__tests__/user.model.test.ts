import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserModel } from '../user.model';
import { User } from '../../types/user.type';
import { ENV } from '../../config/env_variables';

vi.mock('../config/env_variables', () => ({
  ENV: {
    USER_TABLE: 'users-test-table',
    EMAIL_TABLE: 'emails-test-table',
  },
}));

const ddbMock = mockClient(DynamoDBDocumentClient);
const userModel = UserModel(ddbMock as unknown as DynamoDBDocumentClient);

describe('UserModel', () => {
  let mockUser: User;
  const MOCK_USER_ID = 'a1b2c3d4-e5f6-4a5b-9c0d-1e2f3a4b5c6d';
  const MOCK_EMAIL = 'test@example.com';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-15T21:00:00.000Z'));

    mockUser = {
      userId: MOCK_USER_ID,
      email: MOCK_EMAIL,
      passwordHash: 'a_very_secure_password_hash_string_!@#$',
      createdAt: '2025-08-15T20:00:00.000Z',
      updatedAt: '2025-08-15T20:00:00.000Z',
      isActive: true,
      role: 'user',
    };
    ddbMock.reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('should successfully create a user and email lock in a transaction', async () => {
      ddbMock.on(TransactWriteCommand).resolves({});
      const result = await userModel.create(mockUser);

      expect(result).toEqual(mockUser);
      expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Put: {
              TableName: ENV.USER_TABLE,
              Item: mockUser,
              ConditionExpression: 'attribute_not_exists(userId)',
            },
          },
          {
            Put: {
              TableName: ENV.EMAIL_TABLE,
              Item: { email: mockUser.email, userId: mockUser.userId },
              ConditionExpression: 'attribute_not_exists(email)',
            },
          },
        ],
      });
    });

    it('should throw if the transaction fails due to a conditional check', async () => {
      ddbMock
        .on(TransactWriteCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });

      await expect(userModel.create(mockUser)).rejects.toHaveProperty(
        'name',
        'ConditionalCheckFailedException'
      );
    });
  });

  describe('findById', () => {
    it('should return a user when found by ID', async () => {
      ddbMock.on(GetCommand).resolves({ Item: mockUser });
      const result = await userModel.findById(MOCK_USER_ID);
      expect(result).toEqual(mockUser);
    });

    it('should return null when a user is not found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });
      const result = await userModel.findById('UNKNOWN_ID');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [mockUser] });
      const result = await userModel.findByEmail(MOCK_EMAIL);
      expect(result).toEqual(mockUser);
    });

    it('should return null when an email is not found', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });
      const result = await userModel.findByEmail('unknown@example.com');
      expect(result).toBeNull();
    });

    it('should return the first user if multiple are found (edge case)', async () => {
      const secondUser = { ...mockUser, userId: 'another-id' };
      ddbMock.on(QueryCommand).resolves({ Items: [mockUser, secondUser] });
      const result = await userModel.findByEmail(MOCK_EMAIL);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should successfully update a user with provided fields', async () => {
      const updates = {
        firstName: 'John',
        isActive: false,
      };
      const expectedUser = {
        ...mockUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      ddbMock.on(UpdateCommand).resolves({ Attributes: expectedUser });

      const result = await userModel.update(MOCK_USER_ID, updates);

      expect(result).toEqual(expectedUser);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: ENV.USER_TABLE,
        Key: { userId: MOCK_USER_ID },
        UpdateExpression:
          'SET #updatedAt = :updatedAt, #firstName = :firstName, #isActive = :isActive',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
          '#firstName': 'firstName',
          '#isActive': 'isActive',
        },
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
          ':firstName': 'John',
          ':isActive': false,
        },
        ConditionExpression: 'attribute_exists(userId)',
        ReturnValues: 'ALL_NEW',
      });
    });

    it('should throw if the user to update does not exist', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });
      await expect(userModel.update(MOCK_USER_ID, {})).rejects.toHaveProperty(
        'name',
        'ConditionalCheckFailedException'
      );
    });
  });

  describe('delete', () => {
    it('should successfully issue a delete command for a user', async () => {
      ddbMock.on(DeleteCommand).resolves({});
      await expect(userModel.delete(MOCK_USER_ID)).resolves.toBeUndefined();
      expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
        TableName: ENV.USER_TABLE,
        Key: { userId: MOCK_USER_ID },
        ConditionExpression: 'attribute_exists(userId)',
      });
    });

    it('should throw if the user to delete does not exist', async () => {
      ddbMock
        .on(DeleteCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });
      await expect(userModel.delete('UNKNOWN_ID')).rejects.toHaveProperty(
        'name',
        'ConditionalCheckFailedException'
      );
    });
  });

  describe('updateLastLogin', () => {
    it('should correctly update the lastLoginAt timestamp', async () => {
      const timestamp = new Date().toISOString();
      const expectedUser = {
        ...mockUser,
        lastLoginAt: timestamp,
        updatedAt: timestamp,
      };
      ddbMock.on(UpdateCommand).resolves({ Attributes: expectedUser });

      const result = await userModel.updateLastLogin(MOCK_USER_ID, timestamp);

      expect(result).toEqual(expectedUser);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        UpdateExpression:
          'SET #lastLoginAt = :lastLoginAt, #updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':lastLoginAt': timestamp,
          ':updatedAt': timestamp,
        },
      });
    });
  });

  describe('updatePassword', () => {
    it('should correctly update the passwordHash and related timestamps', async () => {
      const newHash = 'new_secure_hash_!@#$';
      const timestamp = new Date().toISOString();
      const expectedUser = {
        ...mockUser,
        passwordHash: newHash,
        updatedAt: timestamp,
        passwordUpdatedAt: timestamp,
      };
      ddbMock.on(UpdateCommand).resolves({ Attributes: expectedUser });

      const result = await userModel.updatePassword(MOCK_USER_ID, newHash);

      expect(result).toEqual(expectedUser);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        UpdateExpression:
          'SET #passwordHash = :passwordHash, #updatedAt = :updatedAt, #passwordUpdatedAt = :passwordUpdatedAt',
        ExpressionAttributeValues: {
          ':passwordHash': newHash,
          ':updatedAt': timestamp,
          ':passwordUpdatedAt': timestamp,
        },
      });
    });
  });

  describe('deactivateUser', () => {
    it('should correctly set isActive to false and nullify lastLoginAt', async () => {
      const timestamp = new Date().toISOString();
      const expectedUser = {
        ...mockUser,
        isActive: false,
        lastLoginAt: null,
        updatedAt: timestamp,
      };
      ddbMock.on(UpdateCommand).resolves({ Attributes: expectedUser });

      const result = await userModel.deactivateUser(MOCK_USER_ID);

      expect(result).toEqual(expectedUser);
      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        UpdateExpression:
          'SET #isActive = :isActive, #updatedAt = :updatedAt, #lastLoginAt = :lastLoginAt',
        ExpressionAttributeValues: {
          ':isActive': false,
          ':updatedAt': timestamp,
          ':lastLoginAt': null,
        },
      });
    });
  });
});
