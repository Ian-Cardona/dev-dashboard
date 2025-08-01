import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';

import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CodeTask, CodeTaskPriority } from '../../types/codetask.type';
import { CodeTaskModel } from '../codetask.model';
import { CODE_TASK_TABLE } from '../../utils/constant';

const mockTask: CodeTask = {
  id: '1',
  userId: 'TEST_USER12345',
  content: 'This is a test content. Please ignore.',
  filePath: '/This/Is/A/Test/FilePath',
  lineNumber: 1,
  syncedAt: '2025-07-31T14:42:05.000Z',
  priority: CodeTaskPriority.LOW,
  status: 'todo',
  type: 'TODO',
};

const ddbMock = mockClient(DynamoDBDocumentClient);

const codeTaskModel = CodeTaskModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('CodeTask Model', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('create', () => {
    it('should successfully create a new CodeTask and return it', async () => {
      ddbMock.on(PutCommand).resolves({});

      const result = await codeTaskModel.create(mockTask);

      console.log(result); // TODO: Use proper logging
      expect(result).toEqual(mockTask);

      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: CODE_TASK_TABLE,
        Item: mockTask,
      });
    });
  });
});
