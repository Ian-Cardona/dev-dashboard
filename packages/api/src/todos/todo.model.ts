import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ENV } from '../config/env_variables';
import { Todo, ProjectNames } from '@dev-dashboard/shared';

const TODOS_TABLE = ENV.TODOS_TABLE;

export interface ITodoModel {
  batchCreate(todos: Todo[]): Promise<void>;
  create(todo: Todo): Promise<Todo>;
  findByUserId(userId: string): Promise<Todo[]>;
  findByUserIdAndSyncId(userId: string, syncId: string): Promise<Todo[]>;
  findLatestByUserId(userId: string): Promise<Todo[]>;
  findRecentByUserId(userId: string, limit?: number): Promise<Todo[]>;
  findProjectsByUserId(userId: string): Promise<ProjectNames>;
  findByUserIdAndProject(
    userId: string,
    projectName: string,
    limit?: number
  ): Promise<Todo[]>;
  update(id: string, userId: string, updates: Partial<Todo>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const TodoModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async batchCreate(todos: Todo[]): Promise<void> {
      if (todos.length === 0) return;

      const BATCH_SIZE = 25;

      for (let i = 0; i < todos.length; i += BATCH_SIZE) {
        const chunk = todos.slice(i, i + BATCH_SIZE);

        const request = new BatchWriteCommand({
          RequestItems: {
            [TODOS_TABLE]: chunk.map(todo => ({
              PutRequest: {
                Item: todo,
              },
            })),
          },
        });

        await docClient.send(request);
      }
    },

    async create(todo: Todo): Promise<Todo> {
      await docClient.send(
        new PutCommand({
          TableName: TODOS_TABLE,
          Item: todo,
        })
      );
      return todo;
    },

    async findByUserId(userId: string): Promise<Todo[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserSyncIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as Todo[];
    },

    async findByUserIdAndSyncId(
      userId: string,
      syncId: string
    ): Promise<Todo[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserSyncIndex',
          KeyConditionExpression: 'userId = :userId AND syncId = :syncId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':syncId': syncId,
          },
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as Todo[];
    },

    async findLatestByUserId(userId: string): Promise<Todo[]> {
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
        return [];
      }

      const latestSyncId = latestItemQuery.Items[0].syncId;

      const result = await docClient.send(
        new QueryCommand({
          TableName: TODOS_TABLE,
          IndexName: 'UserSyncIndex',
          KeyConditionExpression: 'userId = :userId AND syncId = :syncId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':syncId': latestSyncId,
          },
        })
      );

      return (result.Items ?? []) as Todo[];
    },

    async findRecentByUserId(userId: string, limit = 5): Promise<Todo[]> {
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

      console.log('Latest Syncs', latestSyncsQuery.Items);

      const syncIds = Array.from(
        new Set((latestSyncsQuery.Items ?? []).map(item => item.syncId))
      );

      if (syncIds.length === 0) {
        return [];
      }

      const results: Todo[] = [];

      for (const syncId of syncIds) {
        const query = await docClient.send(
          new QueryCommand({
            TableName: TODOS_TABLE,
            IndexName: 'UserSyncIndex',
            KeyConditionExpression: 'userId = :userId AND syncId = :syncId',
            ExpressionAttributeValues: {
              ':userId': userId,
              ':syncId': syncId,
            },
          })
        );
        if (query.Items) {
          results.push(...(query.Items as Todo[]));
        }
      }

      return results;
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
    ): Promise<Todo[]> {
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

      return result.Items as Todo[];
    },

    async update(id: string, userId: string, updates: Partial<Todo>) {
      const updateExpression: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, unknown> = {};

      Object.keys(updates).forEach(key => {
        const attrNamePlaceholder = `#${key}`;
        const attrValuePlaceholder = `:${key}`;

        updateExpression.push(
          `${attrNamePlaceholder} = ${attrValuePlaceholder}`
        );
        expressionAttributeNames[attrNamePlaceholder] = key;
        expressionAttributeValues[attrValuePlaceholder] =
          updates[key as keyof Todo];
      });

      if (updateExpression.length === 0) {
        return;
      }

      await docClient.send(
        new UpdateCommand({
          TableName: TODOS_TABLE,
          Key: { id, userId },
          UpdateExpression: `SET ${updateExpression.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ConditionExpression: 'attribute_exists(id)',
        })
      );
    },

    async delete(id: string, userId: string) {
      await docClient.send(
        new DeleteCommand({
          TableName: TODOS_TABLE,
          Key: { id, userId },
          ConditionExpression: 'attribute_exists(id)',
        })
      );
    },
  };
};
