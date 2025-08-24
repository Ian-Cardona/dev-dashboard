import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Todo } from '../../../shared/types/todo.type';
import { ENV } from '../config/env_variables';

const TODO_TABLE = ENV.CODE_TASK_TABLE;

export interface ITodoModel {
  create(data: Todo): Promise<Todo>;
  findByUserId(userId: string): Promise<Todo[]>;
  update(id: string, userId: string, updates: Partial<Todo>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const TodoModel = (docClient: DynamoDBDocumentClient) => {
  return {
    async create(todo: Todo): Promise<Todo> {
      await docClient.send(
        new PutCommand({
          TableName: TODO_TABLE,
          Item: todo,
        })
      );
      return todo;
    },

    async findByUserId(userId: string): Promise<Todo[]> {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TODO_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
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
          TableName: TODO_TABLE,
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
          TableName: TODO_TABLE,
          Key: { id, userId },
          ConditionExpression: 'attribute_exists(id)',
        })
      );
    },
  };
};
