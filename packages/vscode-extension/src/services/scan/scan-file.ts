import * as fs from 'fs';
import { RawTodo } from '@dev-dashboard/shared';

export const scanFile = async (filePath: string): Promise<RawTodo[]> => {
  const todoLinePatterns = [
    /(?<!:)\s*\/\/\s*@?([A-Za-z][A-Za-z0-9_-]{0,31})\s*(?:[:\\-]\s*|\s+)(.+)$/i,
    /^\s*(?:\/\*+|\*)\s*@?([A-Za-z][A-Za-z0-9_-]{0,31})\s*(?:[:\\-]\s*|\s+)(.+)$/i,
  ];

  const todos: RawTodo[] = [];

  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      for (const pattern of todoLinePatterns) {
        const match = line.match(pattern);
        if (match) {
          const rawContent = match[2].replace(/\s*\*\/\s*$/, '');
          todos.push({
            type: match[1].toUpperCase(),
            content: rawContent.trim(),
            filePath,
            lineNumber: index + 1,
          });
          break;
        }
      }
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error}`);
  }

  return todos;
};
