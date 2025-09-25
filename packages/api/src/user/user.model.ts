import { ENV } from '../config/env_variables';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from '@dev-dashboard/shared';

const USERS_TABLE = ENV.USERS_TABLE;
const EMAILS_TABLE = ENV.EMAILS_TABLE;

export interface IUserModel {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    id: string,
    updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
  ): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string, timestamp: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  deactivate(id: string): Promise<User>;
}

export const UserModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(user: User): Promise<User> {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: USERS_TABLE,
                Item: user,
                ConditionExpression: 'attribute_not_exists(id)',
              },
            },
            {
              Put: {
                TableName: EMAILS_TABLE,
                Item: { email: user.email, id: user.id },
                ConditionExpression: 'attribute_not_exists(email)',
              },
            },
          ],
        })
      );

      return user as User;
    },

    async findById(id: string): Promise<User | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { id },
        })
      );

      return result.Item ? (result.Item as User) : null;
    },

    async findByEmail(email: string): Promise<User | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: USERS_TABLE,
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: { ':email': email },
        })
      );

      return (result.Items?.[0] as User) ?? null;
    },

    async update(
      id: string,
      updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
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
          TableName: USERS_TABLE,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: attributeNames,
          ExpressionAttributeValues: attributeValues,
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async delete(id: string): Promise<void> {
      await docClient.send(
        new DeleteCommand({
          TableName: USERS_TABLE,
          Key: { id },
          ConditionExpression: 'attribute_exists(id)',
        })
      );
    },

    async updateLastLogin(id: string, timestamp: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { id },
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
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async updatePassword(id: string, passwordHash: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { id },
          UpdateExpression:
            'SET #passwordHash = :passwordHash, #updatedAt = :updatedAt, #passwordUpdatedAt = :passwordUpdatedAt',
          ExpressionAttributeNames: {
            '#passwordHash': 'passwordHash',
            '#updatedAt': 'updatedAt',
            '#passwordUpdatedAt': 'passwordUpdatedAt',
          },
          ExpressionAttributeValues: {
            ':passwordHash': passwordHash,
            ':updatedAt': new Date().toISOString(),
            ':passwordUpdatedAt': new Date().toISOString(),
          },
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async deactivate(id: string): Promise<User> {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { id },
          UpdateExpression:
            'SET #isActive = :isActive, #updatedAt = :updatedAt, #lastLoginAt = :lastLoginAt',
          ExpressionAttributeNames: {
            '#isActive': 'isActive',
            '#updatedAt': 'updatedAt',
            '#lastLoginAt': 'lastLoginAt',
          },
          ExpressionAttributeValues: {
            ':isActive': false,
            ':updatedAt': new Date().toISOString(),
            ':lastLoginAt': null,
          },
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes as User;
    },
  };
};
