import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from '../types/user.type';
import { ENV } from '../config/env_variables';

const USER_TABLE = ENV.USER_TABLE;
const EMAIL_TABLE = ENV.EMAIL_TABLE;

export interface IUserModel {
  create(user: User): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<User>;
  delete(userId: string): Promise<void>;
  updateLastLogin(userId: string, timestamp: string): Promise<User>;
  updatePassword(userId: string, passwordHash: string): Promise<User>;
  deactivateUser(userId: string): Promise<User>;
}

export const UserModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(user: User): Promise<User> {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: USER_TABLE,
                Item: user,
                ConditionExpression: 'attribute_not_exists(userId)',
              },
            },
            {
              Put: {
                TableName: EMAIL_TABLE,
                Item: { email: user.email, userId: user.userId },
                ConditionExpression: 'attribute_not_exists(email)',
              },
            },
          ],
        })
      );

      return user as User;
    },

    async findById(userId: string): Promise<User | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: USER_TABLE,
          Key: { userId },
        })
      );

      return result.Item ? (result.Item as User) : null;
    },

    async findByEmail(email: string): Promise<User | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: USER_TABLE,
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: { ':email': email },
        })
      );

      return (result.Items?.[0] as User) ?? null;
    },

    async update(
      userId: string,
      updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
    ): Promise<User> {
      const updateExpressions: string[] = [];
      const attributeNames: Record<string, string> = {};
      const attributeValues: Record<string, unknown> = {};

      updateExpressions.push('#updatedAt = :updatedAt');
      attributeNames['#updatedAt'] = 'updatedAt';
      attributeValues[':updatedAt'] = new Date().toISOString();

      if (updates.firstName !== undefined) {
        updateExpressions.push('#firstName = :firstName');
        attributeNames['#firstName'] = 'firstName';
        attributeValues[':firstName'] = updates.firstName;
      }

      if (updates.lastName !== undefined) {
        updateExpressions.push('#lastName = :lastName');
        attributeNames['#lastName'] = 'lastName';
        attributeValues[':lastName'] = updates.lastName;
      }

      if (updates.isActive !== undefined) {
        updateExpressions.push('#isActive = :isActive');
        attributeNames['#isActive'] = 'isActive';
        attributeValues[':isActive'] = updates.isActive;
      }

      const result = await docClient.send(
        new UpdateCommand({
          TableName: USER_TABLE,
          Key: { userId },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: attributeNames,
          ExpressionAttributeValues: attributeValues,
          ConditionExpression: 'attribute_exists(userId)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async delete(userId: string): Promise<void> {
      await docClient.send(
        new DeleteCommand({
          TableName: USER_TABLE,
          Key: { userId },
          ConditionExpression: 'attribute_exists(userId)',
        })
      );
    },

    async updateLastLogin(userId: string, timestamp: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USER_TABLE,
          Key: { userId },
          UpdateExpression:
            'SET #lastLoginAt = :lastLoginAt, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#lastLoginAt': 'lastLoginAt',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':lastLoginAt': timestamp,
            ':updatedAt': new Date().toISOString(),
          },
          ConditionExpression: 'attribute_exists(userId)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async updatePassword(userId: string, passwordHash: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USER_TABLE,
          Key: { userId },
          UpdateExpression:
            'SET #passwordHash = :passwordHash, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#passwordHash': 'passwordHash',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':passwordHash': passwordHash,
            ':updatedAt': new Date().toISOString(),
          },
          ConditionExpression: 'attribute_exists(userId)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async deactivateUser(userId: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USER_TABLE,
          Key: { userId },
          UpdateExpression:
            'SET #isActive = :isActive, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#isActive': 'isActive',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':isActive': false,
            ':updatedAt': new Date().toISOString(),
          },
          ConditionExpression: 'attribute_exists(userId)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },
  };
};
