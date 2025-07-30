import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient } from '../config/dynamodb';
import { CodeTask } from '../types/codetask.type';

// TODO: Add const to a const file
const CODE_TASK_TABLE = 'CodeTask';
// const CODE_TASKS_RESPONSE = 'CodeTasksResponse';

export const CodeTaskModel = {
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

    return result.Items as CodeTask[];
  },

  async update(id: string, userId: string, updates: Partial<CodeTask>) {
    const updateExpression: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpression.push(`${key} = :val${index}`);
      expressionAttributeValues[`:val${index}`] =
        updates[key as keyof CodeTask];
    });

    await docClient.send(
      new UpdateCommand({
        TableName: CODE_TASK_TABLE,
        Key: { id, userId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  },

  async delete(id: string, userId: string) {
    await docClient.send(
      new DeleteCommand({
        TableName: CODE_TASK_TABLE,
        Key: { id, userId },
      })
    );
  },
};
