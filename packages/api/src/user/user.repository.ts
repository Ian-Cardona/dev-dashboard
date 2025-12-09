import { IUserRepository } from './interfaces/iuser.repository';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  TransactWriteCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { User, UpdateUser, GithubProvider } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';
import { ConflictError } from 'src/utils/errors.utils';

const USERS_TABLE = ENV.USERS_TABLE;
const EMAILS_TABLE = ENV.EMAILS_TABLE;
const PROVIDERS_TABLE = ENV.PROVIDERS_TABLE;

const MODULE_NAME = 'UserRepository';

export const UserRepository = (
  docClient: DynamoDBDocumentClient
): IUserRepository => {
  const _createUserRecord = async (
    user: User,
    providerAccessTokenEncrypted: string = '',
    providerUpdatedAt: string = new Date().toISOString()
  ): Promise<User> => {
    const transactItems: NonNullable<
      TransactWriteCommandInput['TransactItems']
    > = [
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
    ];
    if (
      user.providers &&
      user.providers.length > 0 &&
      providerAccessTokenEncrypted
    ) {
      transactItems.push({
        Put: {
          TableName: PROVIDERS_TABLE,
          Item: {
            provider: user.providers[0].provider,
            providerUserId: user.providers[0].providerUserId,
            userId: user.id,
            accessTokenEncrypted: providerAccessTokenEncrypted,
            updatedAt: providerUpdatedAt,
          },
          ConditionExpression:
            'attribute_not_exists(provider) AND attribute_not_exists(providerUserId)',
        },
      });
    }
    await docClient.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      })
    );
    return user;
  };

  return {
    async createByEmail(user: User): Promise<User> {
      if (!user.email || !user.passwordHash) {
        throw new ConflictError(
          `[${MODULE_NAME}] ${user.id} failed to register by email`
        );
      }

      await _createUserRecord(user);

      return user as User;
    },

    async createByOAuth(
      user: User,
      providerAccessToken: string
    ): Promise<User> {
      if (!user.providers || !user.email || user.providers.length === 0) {
        throw new ConflictError(
          `[${MODULE_NAME}] ${user.id} failed to via OAuth`
        );
      }

      await _createUserRecord(user, providerAccessToken);
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

    async findByProvider(
      provider: string,
      providerUserId: string
    ): Promise<User | null> {
      const providerResult = await docClient.send(
        new GetCommand({
          TableName: PROVIDERS_TABLE,
          Key: { provider, providerUserId },
        })
      );

      const providerItem = providerResult.Item;
      if (!providerItem?.userId) return null;

      const userResult = await docClient.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { id: providerItem.userId },
        })
      );

      return userResult.Item ? (userResult.Item as User) : null;
    },

    async findProviderByUserId(
      userId: string,
      provider: string
    ): Promise<GithubProvider | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: PROVIDERS_TABLE,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId and provider = :provider',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':provider': provider,
          },
        })
      );

      if (!result.Items || result.Items.length === 0) {
        return null;
      }

      const item = result.Items[0];
      return {
        provider: item.provider,
        providerUserId: item.providerUserId,
        accessTokenEncrypted: item.accessTokenEncrypted,
        updatedAt: item.updatedAt,
      };
    },

    async findProvidersByUserId(userId: string): Promise<GithubProvider[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: PROVIDERS_TABLE,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        })
      );

      return result.Items ? (result.Items as GithubProvider[]) : [];
    },

    async updateProvider(updates: GithubProvider): Promise<void> {
      const {
        provider,
        providerUserId,
        updatedAt: providerUpdatedAt,
        accessTokenEncrypted: providerAccessTokenEncrypted,
      } = updates;
      await docClient.send(
        new UpdateCommand({
          TableName: PROVIDERS_TABLE,
          Key: { provider, providerUserId },
          UpdateExpression:
            'SET #accessTokenEncrypted = :accessTokenEncrypted, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#accessTokenEncrypted': 'accessTokenEncrypted',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':accessTokenEncrypted': providerAccessTokenEncrypted,
            ':updatedAt': providerUpdatedAt,
          },
          ConditionExpression: 'attribute_exists(providerUserId)',
        })
      );
    },

    async linkProvider(user: User, providerAccessToken: string): Promise<User> {
      if (
        !user.providers ||
        user.providers.length === 0 ||
        !providerAccessToken
      ) {
        throw new ConflictError(
          `[${MODULE_NAME}] ${user.id} missing providers or access token`
        );
      }

      const provider = user.providers[0];
      const updatedAt = new Date().toISOString();
      const transactItems: NonNullable<
        TransactWriteCommandInput['TransactItems']
      > = [
        {
          Update: {
            TableName: USERS_TABLE,
            Key: { id: user.id },
            UpdateExpression:
              'SET #providers = :providers, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
              '#providers': 'providers',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':providers': user.providers,
              ':updatedAt': updatedAt,
            },
            ConditionExpression: 'attribute_exists(id)',
          },
        },
        {
          Put: {
            TableName: PROVIDERS_TABLE,
            Item: {
              provider: provider.provider,
              providerUserId: provider.providerUserId,
              userId: user.id,
              accessTokenEncrypted: providerAccessToken,
              updatedAt: updatedAt,
            },
            ConditionExpression:
              'attribute_not_exists(providerUserId) OR userId = :userId',
            ExpressionAttributeValues: {
              ':userId': user.id,
            },
          },
        },
      ];

      try {
        await docClient.send(
          new TransactWriteCommand({
            TransactItems: transactItems,
          })
        );
        return user;
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'TransactionCanceledException'
        ) {
          throw new ConflictError(
            `[${MODULE_NAME}] ${user.id} failed to link provider - user may not exist or provider already linked to another user`
          );
        }
        throw error;
      }
    },

    async unlinkProvider(userId: string, provider: string): Promise<void> {
      const user = await this.findById(userId);
      if (!user) {
        throw new ConflictError(`[${MODULE_NAME}] User ${userId} not found`);
      }

      const existingProvider = await this.findProviderByUserId(
        userId,
        provider
      );
      if (!existingProvider) {
        throw new ConflictError(
          `[${MODULE_NAME}] Provider ${provider} not linked to user ${userId}`
        );
      }

      const updatedAt = new Date().toISOString();

      const transactItems: NonNullable<
        TransactWriteCommandInput['TransactItems']
      > = [
        {
          Update: {
            TableName: USERS_TABLE,
            Key: { id: userId },
            UpdateExpression: 'REMOVE #providers SET #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
              '#providers': 'providers',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':updatedAt': updatedAt,
            },
            ConditionExpression: 'attribute_exists(id)',
          },
        },
        {
          Delete: {
            TableName: PROVIDERS_TABLE,
            Key: {
              provider: provider,
              providerUserId: existingProvider.providerUserId,
            },
            ConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId,
            },
          },
        },
      ];

      try {
        await docClient.send(
          new TransactWriteCommand({
            TransactItems: transactItems,
          })
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'TransactionCanceledException'
        ) {
          throw new ConflictError(
            `[${MODULE_NAME}] Failed to unlink provider ${provider} from user ${userId}`
          );
        }
        throw error;
      }
    },

    async update(id: string, updates: UpdateUser): Promise<User> {
      const updateExpressions: string[] = [];
      const attributeNames: Record<string, string> = {};
      const attributeValues: Record<string, unknown> = {};

      updateExpressions.push('#updatedAt = :updatedAt');
      attributeNames['#updatedAt'] = 'updatedAt';
      attributeValues[':updatedAt'] = new Date().toISOString();

      const allowedFields = ['firstName', 'lastName'] as const;
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateExpressions.push(`#${field} = :${field}`);
          attributeNames[`#${field}`] = field;
          attributeValues[`:${field}`] = updates[field];
        }
      }

      if (updateExpressions.length === 1) {
        throw new Error('No valid fields to update');
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
      const updatedAt = new Date().toISOString();
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
            ':updatedAt': updatedAt,
          },
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async updatePassword(id: string, passwordHash: string): Promise<User> {
      const updatedAt = new Date().toISOString();
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
            ':updatedAt': updatedAt,
            ':passwordUpdatedAt': updatedAt,
          },
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as User;
    },

    async deactivate(id: string): Promise<User> {
      const updatedAt = new Date().toISOString();
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
            ':updatedAt': updatedAt,
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
