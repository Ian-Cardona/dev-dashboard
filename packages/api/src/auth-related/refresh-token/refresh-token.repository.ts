import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandOutput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { RefreshToken } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

const REFRESH_TOKENS_TABLE = ENV.REFRESH_TOKENS_TABLE;
const BATCH_CHUNK_SIZE = 25;

export const RefreshTokenRepository = (docClient: DynamoDBDocumentClient) => {
  const processBatch = async (items: Array<Record<string, string>>) => {
    const chunks = [];
    for (let i = 0; i < items.length; i += BATCH_CHUNK_SIZE) {
      chunks.push(items.slice(i, i + BATCH_CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [REFRESH_TOKENS_TABLE]: chunk.map(item => ({
              DeleteRequest: {
                Key: {
                  userId: item.userId,
                  id: item.id,
                },
              },
            })),
          },
        })
      );
    }
  };

  return {
    async create(token: RefreshToken): Promise<RefreshToken> {
      await docClient.send(
        new PutCommand({
          TableName: REFRESH_TOKENS_TABLE,
          Item: token,
          ConditionExpression:
            'attribute_not_exists(userId) AND attribute_not_exists(id)',
        })
      );
      return token;
    },

    async findById(id: string): Promise<RefreshToken | null> {
      const result = await docClient.send(
        new GetCommand({
          TableName: REFRESH_TOKENS_TABLE,
          Key: {
            id: id,
          },
        })
      );

      return (result.Item as RefreshToken) || null;
    },

    // async findByUserId(userId: string): Promise<RefreshToken[] | null> {
    //   const result = await docClient.send(
    //     new QueryCommand({
    //       TableName: REFRESH_TOKENS_TABLE,
    //       KeyConditionExpression: 'userId = :userId',
    //       ExpressionAttributeValues: {
    //         ':userId': userId,
    //       },
    //     })
    //   );

    //   return (result.Items as RefreshToken[]) || [];
    // },

    // async findByToken(token: string): Promise<RefreshToken | null> {
    //   const result = await docClient.send(
    //     new QueryCommand({
    //       TableName: REFRESH_TOKENS_TABLE,
    //       IndexName: 'RefreshTokenGSI',
    //       KeyConditionExpression: 'token = :token',
    //       ExpressionAttributeValues: {
    //         ':token': token,
    //       },
    //     })
    //   );

    //   return (result.Items as RefreshToken[])?.[0] || null;
    // },

    // async deleteToken(userId: string, id: string): Promise<void> {
    //   await docClient.send(
    //     new DeleteCommand({
    //       TableName: REFRESH_TOKENS_TABLE,
    //       Key: { userId, id },
    //       ConditionExpression:
    //         'attribute_exists(userId) AND attribute_exists(id)',
    //     })
    //   );
    // },

    async tombstone(token: RefreshToken): Promise<void> {
      await docClient.send(
        new UpdateCommand({
          TableName: REFRESH_TOKENS_TABLE,
          Key: {
            id: token.id,
          },
          UpdateExpression: 'SET revoked = :revoked, revokedAt = :revokedAt',
          ConditionExpression:
            'userId = :userId AND (attribute_not_exists(revoked) OR revoked = :false)',
          ExpressionAttributeValues: {
            ':revoked': token.revoked,
            ':revokedAt': token.revokedAt,
            ':false': false,
            ':userId': token.userId,
          },
        })
      );
    },

    async deleteAllByUserId(userId: string): Promise<void> {
      let ExclusiveStartKey: Record<string, string> | undefined;

      do {
        const queryResult: QueryCommandOutput = await docClient.send(
          new QueryCommand({
            TableName: REFRESH_TOKENS_TABLE,
            KeyConditionExpression: 'userId = :uuid',
            ExpressionAttributeValues: { ':uuid': userId },
            ProjectionExpression: 'userId, id',
            ExclusiveStartKey,
          })
        );

        if (!queryResult.Items?.length) break;

        await processBatch(queryResult.Items);
        ExclusiveStartKey = queryResult.LastEvaluatedKey;
      } while (ExclusiveStartKey);
    },

    async deleteExpired(): Promise<number> {
      let ExclusiveStartKey: Record<string, string> | undefined;
      const now = new Date().toISOString();
      let totalDeleted = 0;

      do {
        const scanResult: ScanCommandOutput = await docClient.send(
          new ScanCommand({
            TableName: REFRESH_TOKENS_TABLE,
            FilterExpression: 'expiresAt < :now',
            ExpressionAttributeValues: { ':now': now },
            ProjectionExpression: 'userId, id',
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
