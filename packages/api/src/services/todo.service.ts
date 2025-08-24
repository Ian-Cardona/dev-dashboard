import {
  CreateTodo,
  Meta,
  Todo,
  TodoItem,
  TodosInfo,
} from '../../../shared/types/todo.type';
import { ITodoModel } from '../models/todo.model';
import { generateUUID } from '../utils/uuid.utils';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { NotFoundError } from '../utils/errors.utils';
import { classifyTag } from '../utils/classifier';
import { todoSchema } from '../../../shared/schemas/todo.schema';

export interface ITodoService {
  syncTodos(
    userId: string,
    data: TodoItem[]
  ): Promise<{ todos: Todo[]; meta: Meta }>;
  create(data: CreateTodo): Promise<Todo>;
  findByUserId(userId: string): Promise<TodosInfo>;
  update(id: string, userId: string, updates: Partial<Todo>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}

export const TodoService = (TodoModel: ITodoModel): ITodoService => {
  const processRawTodo = async (item: TodoItem): Promise<Todo> => {
    const { type, customTag } = classifyTag(item.content);

    return todoSchema.parse({
      ...item,
      id: generateUUID(),
      syncedAt: new Date().toISOString(),
      type,
      customTag,
    });
  };

  return {
    async syncTodos(
      userId: string,
      data: TodoItem[]
    ): Promise<{ todos: Todo[]; meta: Meta }> {
      try {
        const processedTodos = await Promise.all(data.map(processRawTodo));
        console.log('Total todos processed:', processedTodos.length);

        const scannedFiles = new Set(data.map(item => item.filePath)).size;

        const meta: Meta = {
          userId,
          totalCount: processedTodos.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles,
        };

        // await TodoModel.batchCreate(processedTodos);
        console.log('Processed todos:', processedTodos);
        console.log('Meta:', meta);

        return { todos: processedTodos, meta };
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Failed to sync todos');
      }
    },

    async create(data: CreateTodo): Promise<Todo> {
      try {
        const newTask: Todo = {
          ...data,
          id: generateUUID(),
          syncedAt: new Date().toISOString(),
        };

        return await TodoModel.create(newTask);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to create task');
      }
    },

    async findByUserId(userId: string): Promise<TodosInfo> {
      try {
        const data = await TodoModel.findByUserId(userId);

        return {
          userId,
          data,
          meta: {
            userId,
            totalCount: data.length,
            lastScanAt: new Date().toISOString(),
            scannedFiles: 0,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Failed to retrieve tasks');
      }
    },

    async update(id: string, userId: string, updates: Partial<Todo>) {
      try {
        await TodoModel.update(id, userId, updates);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID not found.`);
        }

        throw new Error('Could not update the task.');
      }
    },

    async delete(id: string, userId: string): Promise<void> {
      try {
        await TodoModel.delete(id, userId);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError(`Task with ID not found.`);
        }

        throw new Error('Could not delete the task.');
      }
    },
  };
};
