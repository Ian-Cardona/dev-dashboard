import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CodeTask } from '../types/codetask.type';
import { CODE_TASK_TABLE } from '../constants/tables';

export interface ICodeTaskModel {
  create(data: CodeTask): Promise<CodeTask>;
  findByUserId(userId: string): Promise<CodeTask[]>;
  update(id: string, userId: string, updates: Partial<CodeTask>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const CodeTaskModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(task: CodeTask): Promise<CodeTask> {
      await docClient.send(
        new PutCommand({
          TableName: CODE_TASK_TABLE,
          Item: task,
        })
      );
      return task;
    },

    async findByUserId(userId: string): Promise<CodeTask[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: CODE_TASK_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
        })
      );

      if (!result.Items || !Array.isArray(result.Items)) {
        return [];
      }

      return result.Items as CodeTask[];
    },

    async update(id: string, userId: string, updates: Partial<CodeTask>) {
      const updateExpression: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expressionAttributeValues: Record<string, any> = {};

      Object.keys(updates).forEach(key => {
        const attrNamePlaceholder = `#${key}`;
        const attrValuePlaceholder = `:${key}`;

        updateExpression.push(
          `${attrNamePlaceholder} = ${attrValuePlaceholder}`
        );
        expressionAttributeNames[attrNamePlaceholder] = key;
        expressionAttributeValues[attrValuePlaceholder] =
          updates[key as keyof CodeTask];
      });

      if (updateExpression.length === 0) {
        return;
      }

      await docClient.send(
        new UpdateCommand({
          TableName: CODE_TASK_TABLE,
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
          TableName: CODE_TASK_TABLE,
          Key: { id, userId },
          ConditionExpression: 'attribute_exists(id)',
        })
      );
    },
  };
};
