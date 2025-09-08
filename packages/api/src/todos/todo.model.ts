import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ENV } from '../config/env_variables';
import { ProjectNames, TodoBatch, TodoResolution } from '@dev-dashboard/shared';

const TODOS_TABLE = ENV.TODOS_TABLE;
const RESOLUTIONS_TABLE = ENV.RESOLUTIONS_TABLE;

export interface ITodoModel {
  create(batch: TodoBatch): Promise<TodoBatch>;
  findByUserId(userId: string): Promise<TodoBatch[]>;
  findByUserIdAndSyncId(
    userId: string,
    syncId: string
  ): Promise<TodoBatch | null>;
  findLatestByUserId(userId: string): Promise<TodoBatch | null>;
  findRecentByUserId(userId: string, limit?: number): Promise<TodoBatch[]>;
  findProjectsByUserId(userId: string): Promise<ProjectNames>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<TodoBatch[]>;
  findPendingResolutionsByUserId(userId: string): Promise<TodoResolution[]>;
  createResolution(resolution: TodoResolution): Promise<TodoResolution>;
}

export const TodoModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(batch: TodoBatch): Promise<TodoBatch> {
      await docClient.send(
        new PutCommand({
          TableName: TODOS_TABLE,
          Item: { ...batch, id: batch.syncId },
        })
      );
      return batch;
    },

    async findByUserId(userId: string): Promise<TodoBatch[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as TodoBatch[];
    },

    async findByUserIdAndSyncId(
      userId: string,
      syncId: string
    ): Promise<TodoBatch | null> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserSyncIndex',
          KeyConditionExpression: 'userId = :userId AND syncId = :syncId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':syncId': syncId,
          },
          Limit: 1,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        return null;
      }

      return result.Items[0] as TodoBatch;
    },

    async findLatestByUserId(userId: string): Promise<TodoBatch | null> {
      const latestItemQuery = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
          Limit: 1,
        })
      );

      if (!latestItemQuery.Items || latestItemQuery.Items.length === 0) {
        return null;
      }

      return latestItemQuery.Items[0] as TodoBatch;
    },

    async findRecentByUserId(userId: string, limit = 5): Promise<TodoBatch[]> {
      const latestSyncsQuery = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserLatestSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ScanIndexForward: false,
          Limit: limit,
        })
      );

      if (!latestSyncsQuery.Items || latestSyncsQuery.Items.length === 0) {
        return [];
      }

      return latestSyncsQuery.Items as TodoBatch[];
    },

    async findProjectsByUserId(userId: string): Promise<ProjectNames> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserProjectIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          ProjectionExpression: 'projectName',
        })
      );
      if (!result.Items || !Array.isArray(result.Items)) {
        return { projects: [] };
      }
      const projectNames = result.Items.map(item => item.projectName).filter(
        (name): name is string => typeof name === 'string'
      );
      return { projects: Array.from(new Set(projectNames)) };
    },

    async findByUserIdAndProject(
      userId: string,
      projectName: string,
      limit = 100
    ): Promise<TodoBatch[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
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

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as TodoBatch[];
    },

    async findPendingResolutionsByUserId(
      userId: string
    ): Promise<TodoResolution[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: RESOLUTIONS_TABLE,
          KeyConditionExpression: 'userId = :userId',
          FilterExpression: 'resolved = :resolved',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':resolved': false,
          },
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as TodoResolution[];
    },

    async createResolution(
      resolution: TodoResolution
    ): Promise<TodoResolution> {
      await docClient.send(
        new PutCommand({
          TableName: RESOLUTIONS_TABLE,
          Item: resolution,
        })
      );
      return resolution;
    },
  };
};
