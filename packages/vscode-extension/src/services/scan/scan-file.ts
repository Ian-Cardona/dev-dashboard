import * as fs from 'fs';
import { RawTodo } from '@dev-dashboard/shared';

export const scanFile = async (filePath: string): Promise<RawTodo[]> => {
  const todos: RawTodo[] = [];

  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Known tags (TODO, FIXME, etc.) - uppercase only, followed by colon or dash
      const knownMatch =
        line.match(/^\s*\/\/\s*(TODO|FIXME|HACK|NOTE|BUG|XXX)[:\\-]\s*(.+)$/) ||
        line.match(
          /^\s*(?:\/\*+|\*)\s*(TODO|FIXME|HACK|NOTE|BUG|XXX)[:\\-]\s*(.+)$/
        );

      if (knownMatch) {
        const rawContent = knownMatch[2].replace(/\s*\*\/\s*$/, '');
        todos.push({
          type: knownMatch[1].toUpperCase(),
          content: rawContent.trim(),
          filePath,
          lineNumber: index + 1,
        });
        return;
      }

      // Custom tags - all caps words 2-20 letters, no @, followed by colon or dash
      const customMatch =
        line.match(/^\s*\/\/\s*([A-Z]{2,20})[:\\-]\s*(.+)$/) ||
        line.match(/^\s*(?:\/\*+|\*)\s*([A-Z]{2,20})[:\\-]\s*(.+)$/);

      if (customMatch) {
        const tag = customMatch[1];
        // Exclude common words like IMPORT or other known non-tags
        if (
          ![
            'IMPORT',
            'EXPORT',
            'FROM',
            'IF',
            'ELSE',
            'FOR',
            'WHILE',
            'RETURN',
            'CONST',
            'LET',
            'VAR',
            'FUNCTION',
            'CLASS',
            'INTERFACE',
            'TYPE',
          ].includes(tag)
        ) {
          const rawContent = customMatch[2].replace(/\s*\*\/\s*$/, '');
          todos.push({
            type: 'OTHER',
            customTag: tag.toUpperCase(),
            content: rawContent.trim(),
            filePath,
            lineNumber: index + 1,
          } as RawTodo);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error}`);
  }

  return todos;
};
