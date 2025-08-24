import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { CodeTask } from '../../types/codetask.type';
import { CodeTaskModel } from '../todo.model';
import { ENV } from '../../config/env_variables';

vi.mock('../../config/env_variables', () => ({
  ENV: {
    CODE_TASK_TABLE: 'code-task-test-table',
  },
}));

const ddbMock = mockClient(DynamoDBDocumentClient);
const codeTaskModel = CodeTaskModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('CodeTaskModel', () => {
  const MOCK_USER_ID = 'TEST_USER12345';
  const MOCK_TASK_ID = '1';

  let mockTask: CodeTask;

  beforeEach(() => {
    ddbMock.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-15T21:00:00.000Z'));

    mockTask = {
      id: MOCK_TASK_ID,
      userId: MOCK_USER_ID,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: 'low',
      status: 'todo',
      type: 'TODO',
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('should successfully create a CodeTask and return it', async () => {
      ddbMock.on(PutCommand).resolves({});
      const result = await codeTaskModel.create(mockTask);

      expect(result).toEqual(mockTask);
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: ENV.CODE_TASK_TABLE,
        Item: mockTask,
      });
    });

    it('should throw if PutCommand fails', async () => {
      ddbMock.on(PutCommand).rejects(new Error('PutCommand failed'));

      await expect(codeTaskModel.create(mockTask)).rejects.toThrow(
        'PutCommand failed'
      );
    });
  });

  describe('findByUserId', () => {
    it('should return an array of CodeTasks for a user', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [mockTask] });
      const result = await codeTaskModel.findByUserId(MOCK_USER_ID);

      expect(result).toEqual([mockTask]);
      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: ENV.CODE_TASK_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': MOCK_USER_ID },
      });
    });

    it('should return empty array if no tasks found', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });
      const result = await codeTaskModel.findByUserId('nonexistent-user');

      expect(result).toEqual([]);
    });

    it('should throw if QueryCommand fails', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('QueryCommand failed'));

      await expect(codeTaskModel.findByUserId(MOCK_USER_ID)).rejects.toThrow(
        'QueryCommand failed'
      );
    });
  });

  describe('update', () => {
    it('should update a single field successfully', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      await codeTaskModel.update(MOCK_TASK_ID, MOCK_USER_ID, {
        content: 'Updated content',
      });

      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: ENV.CODE_TASK_TABLE,
        Key: { id: MOCK_TASK_ID, userId: MOCK_USER_ID },
        UpdateExpression: 'SET #content = :content',
        ExpressionAttributeNames: { '#content': 'content' },
        ExpressionAttributeValues: { ':content': 'Updated content' },
        ConditionExpression: 'attribute_exists(id)',
      });
    });

    it('should update multiple fields successfully', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      await codeTaskModel.update(MOCK_TASK_ID, MOCK_USER_ID, {
        content: 'New content',
        priority: 'high',
        status: 'in-progress',
      });

      expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: ENV.CODE_TASK_TABLE,
        Key: { id: MOCK_TASK_ID, userId: MOCK_USER_ID },
        UpdateExpression:
          'SET #content = :content, #priority = :priority, #status = :status',
        ExpressionAttributeNames: {
          '#content': 'content',
          '#priority': 'priority',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':content': 'New content',
          ':priority': 'high',
          ':status': 'in-progress',
        },
        ConditionExpression: 'attribute_exists(id)',
      });
    });

    it('should throw if UpdateCommand fails due to conditional check', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        codeTaskModel.update(MOCK_TASK_ID, MOCK_USER_ID, {
          content: 'fail update',
        })
      ).rejects.toThrow('ConditionalCheckFailedException');
    });

    it('should do nothing (not throw) if updates is empty', async () => {
      // No UpdateCommand called since updates is empty
      const spySend = vi.spyOn(ddbMock, 'send');

      await expect(
        codeTaskModel.update(MOCK_TASK_ID, MOCK_USER_ID, {})
      ).resolves.toBeUndefined();

      expect(spySend).not.toHaveBeenCalled();

      spySend.mockRestore();
    });
  });

  describe('delete', () => {
    it('should successfully delete a CodeTask by id and userId', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await expect(
        codeTaskModel.delete(MOCK_TASK_ID, MOCK_USER_ID)
      ).resolves.toBeUndefined();

      expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
        TableName: ENV.CODE_TASK_TABLE,
        Key: { id: MOCK_TASK_ID, userId: MOCK_USER_ID },
        ConditionExpression: 'attribute_exists(id)',
      });
    });

    it('should throw if DeleteCommand fails due to missing item', async () => {
      ddbMock
        .on(DeleteCommand)
        .rejects({ name: 'ConditionalCheckFailedException' });

      await expect(
        codeTaskModel.delete(MOCK_TASK_ID, MOCK_USER_ID)
      ).rejects.toHaveProperty('name', 'ConditionalCheckFailedException');
    });
  });
});
