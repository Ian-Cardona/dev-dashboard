import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';

import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CodeTask, CodeTaskPriority } from '../../types/codetask.type';
import { CodeTaskModel } from '../codetask.model';
import { CODE_TASK_TABLE } from '../../constants/tables';

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

export const codeTaskModel = CodeTaskModel(
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

      expect(result).toEqual(mockTask);
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: CODE_TASK_TABLE,
        Item: mockTask,
      });
    });

    it('should handle DynamoDB errors gracefully', async () => {
      ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'));

      await expect(codeTaskModel.create(mockTask)).rejects.toThrow(
        'DynamoDB error'
      );
    });
  });

  describe('findByUserId', () => {
    it('should successfully find a CodeTask by userId and return it', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [mockTask],
      });

      const result = await codeTaskModel.findByUserId('TEST_USER12345');

      expect(result).toEqual([mockTask]);
    });

    it('should return empty array when no tasks found', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });

      const result = await codeTaskModel.findByUserId('NONEXISTENT_USER');

      expect(result).toEqual([]);
    });

    it('should handle DynamoDB errors gracefully', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(
        codeTaskModel.findByUserId('TEST_USER12345')
      ).rejects.toThrow('DynamoDB error');
    });
  });

  describe('update', () => {
    it('should successfully update a single field update', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      await codeTaskModel.update('1', 'TEST_USER12345', {
        content: 'Updated content',
      });

      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: CODE_TASK_TABLE,
        Key: { id: '1', userId: 'TEST_USER12345' },
        UpdateExpression: 'SET #content = :content',
        ExpressionAttributeNames: { '#content': 'content' },
        ExpressionAttributeValues: { ':content': 'Updated content' },
      });
    });

    it('should successfully handle multiple field updates', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      await codeTaskModel.update('1', 'TEST_USER12345', {
        content: 'New content',
        priority: CodeTaskPriority.HIGH,
        status: 'in-progress',
      });

      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: CODE_TASK_TABLE,
        Key: { id: '1', userId: 'TEST_USER12345' },
        UpdateExpression:
          'SET #content = :content, #priority = :priority, #status = :status',
        ExpressionAttributeNames: {
          '#content': 'content',
          '#priority': 'priority',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':content': 'New content',
          ':priority': CodeTaskPriority.HIGH,
          ':status': 'in-progress',
        },
      });
    });

    it('should handle DynamoDB errors gracefully', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        codeTaskModel.update('1', 'TEST_USER12345', {
          content: 'New content',
          priority: CodeTaskPriority.HIGH,
          status: 'in-progress',
        })
      ).rejects.toThrow('ConditionalCheckFailedException');
    });
  });

  describe('delete', () => {
    it('should successfully delete a CodeTask', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await codeTaskModel.delete('1', 'TEST_USER12345');

      expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
        TableName: CODE_TASK_TABLE,
        Key: { id: '1', userId: 'TEST_USER12345' },
      });
    });

    it('should handle DynamoDB errors gracefully', async () => {
      ddbMock.on(DeleteCommand).rejects(new Error('ResourceNotFoundException'));

      await expect(codeTaskModel.delete('1', 'TEST_USER12345')).rejects.toThrow(
        'ResourceNotFoundException'
      );
    });
  });
});
