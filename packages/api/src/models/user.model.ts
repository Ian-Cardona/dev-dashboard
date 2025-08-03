import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { RefreshToken, User } from '../types/user.type';
import { USER_TABLE } from '../constants/tables';

export interface IUserModel {
  create(user: User): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<User>;
  delete(userId: string): Promise<void>;

  updateLastLogin(userId: string, timestamp: string): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  deactivateUser(userId: string): Promise<void>;
}

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

export const UserModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(user: User): Promise<User> {
      await docClient.send(
        new PutCommand({
          TableName: USER_TABLE,
          Item: user,
        })
      );
      return user;
    },

    async findById(userId: string): Promise<User | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: USER_TABLE,
          Key: { userId },
        })
      );
      return result.Item as User | null;
    },

    async findByEmail(email: string): Promise<User | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: USER_TABLE,
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: { ':email': email },
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return null;
      }

      return result.Items[0] as User;
    },

    // TODO: Add all other methods
  };
};
