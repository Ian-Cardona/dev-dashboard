import { ENV } from '../config/env_variables';
import { ITodoModel } from './interfaces/itodo.model';
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ProjectNames, TodoBatch, TodoResolution } from '@dev-dashboard/shared';

const BATCHES_TABLE = ENV.TODO_BATCHES_TABLE;
const RESOLUTIONS_TABLE = ENV.TODO_RESOLUTIONS_TABLE;
const CURRENT_TABLE = ENV.TODO_CURRENT_TABLE;

export const TodoModel = (docClient: DynamoDBDocumentClient): ITodoModel => {
  return {
    async create(batch: TodoBatch): Promise<TodoBatch> {
      await docClient.send(
        new PutCommand({
          TableName: BATCHES_TABLE,
          Item: { ...batch, id: batch.syncId },
        })
      );
      return batch;
    },

    async findByUserId(userId: string): Promise<TodoBatch[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
        })
      );

      return (result.Items as TodoBatch[]) || [];
    },

    async findByUserIdAndSyncId(
      userId: string,
      syncId: string
    ): Promise<TodoBatch | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserSyncIndex',
          KeyConditionExpression: 'userId = :userId AND syncId = :syncId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':syncId': syncId,
          },
          Limit: 1,
        })
      );

      return (result.Items?.[0] as TodoBatch) || null;
    },

    async findLatestByUserId(userId: string): Promise<TodoBatch | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
          Limit: 1,
        })
      );

      return (result.Items?.[0] as TodoBatch) || null;
    },

    async findRecentByUserId(
      userId: string,
      limit: number = 5
    ): Promise<TodoBatch[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
          Limit: limit,
        })
      );

      return (result.Items as TodoBatch[]) || [];
    },

    async findByUserIdAndProject(
      userId: string,
      projectName: string,
      limit: number = 100
    ): Promise<TodoBatch[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserProjectIndex',
          KeyConditionExpression:
            'userId = :userId AND projectName = :projectName',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':projectName': projectName,
          },
          ScanIndexForward: false,
          Limit: limit,
        })
      );

      return (result.Items as TodoBatch[]) || [];
    },

    async findProjectsByUserId(userId: string): Promise<ProjectNames> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: BATCHES_TABLE,
          IndexName: 'UserProjectIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ProjectionExpression: 'projectName',
        })
      );

      if (!result.Items?.length) {
        return { projects: [] };
      }

      const projectNames = result.Items.map(item => item.projectName).filter(
        (name): name is string => typeof name === 'string'
      );

      return { projects: Array.from(new Set(projectNames)) };
    },

    async findPendingResolutionsByUserId(
      userId: string
    ): Promise<TodoResolution[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: CURRENT_TABLE,
          KeyConditionExpression: 'userId = :userId',
          FilterExpression: 'resolved = :resolved',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':resolved': false,
          },
        })
      );

      return (result.Items as TodoResolution[]) || [];
    },

    async createResolutions(
      resolutions: TodoResolution[]
    ): Promise<TodoResolution[]> {
      if (!resolutions.length) return [];

      await Promise.all(
        resolutions.map(resolution =>
          docClient.send(
            new PutCommand({
              TableName: RESOLUTIONS_TABLE,
              Item: resolution,
            })
          )
        )
      );

      return resolutions;
    },

    async getResolved(userId: string): Promise<TodoResolution[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: RESOLUTIONS_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        })
      );

      return (result.Items as TodoResolution[]) || [];
    },

    async createCurrent(items: TodoResolution[]): Promise<TodoResolution[]> {
      if (!items.length) return [];

      await Promise.all(
        items.map(item =>
          docClient.send(
            new PutCommand({
              TableName: CURRENT_TABLE,
              Item: item,
            })
          )
        )
      );

      return items;
    },

    async deleteResolvedCurrent(): Promise<TodoResolution[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: CURRENT_TABLE,
          FilterExpression: 'resolved = :resolved',
          ExpressionAttributeValues: {
            ':resolved': true,
          },
        })
      );

      if (!result.Items?.length) {
        return [];
      }

      const deleteRequests = result.Items.map(item => ({
        DeleteRequest: {
          Key: {
            userId: item.userId,
            id: item.id,
          },
        },
      }));

      const batchSize = 25;
      for (let i = 0; i < deleteRequests.length; i += batchSize) {
        const batch = deleteRequests.slice(i, i + batchSize);
        await docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [CURRENT_TABLE]: batch,
            },
          })
        );
      }

      return result.Items as TodoResolution[];
    },
  };
};
