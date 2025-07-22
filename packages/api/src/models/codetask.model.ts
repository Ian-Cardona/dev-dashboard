import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../config/dynamodb';
import { CodeTask } from '../types/codetask.type';

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
};
