import z from 'zod';
import { PredefinedTodoTypeEnum } from '../../../shared/schemas/todo.schema';

const isPredefinedTag = (
  tag: string
): tag is z.infer<typeof PredefinedTodoTypeEnum> => {
  return (PredefinedTodoTypeEnum.options as readonly string[]).includes(tag);
};

export function classifyTag(content: string) {
  const match = content.match(/^\s*\/\/\s*([A-Z]+)/i);
  const tag = match ? match[1].toUpperCase() : null;

  if (tag && isPredefinedTag(tag)) {
    return { type: tag };
  }

  if (tag) {
    return { type: 'OTHER', customTag: tag };
  }

  return { type: 'TODO' };
}
