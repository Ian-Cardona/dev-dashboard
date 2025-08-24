import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { todosApi } from './todosApi';

// TODO - Define the TODO type in shared
export interface RawTodo {
  type: string;
  content: string;
  file: string;
  line: number;
}

export const scanTodos = async () => {
  const startTime = Date.now();
  console.log('Starting TODO scan...');

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders[0];
  console.log('Scanning workspace:', workspaceFolder.uri.fsPath);

  const files = await getSourceFiles(workspaceFolder.uri.fsPath);
  console.log(`Found ${files.length} files to scan`);

  const todoPromises = files.map(file => scanFileForTodos(file));
  const todoArrays = await Promise.all(todoPromises);
  const allTodos: RawTodo[] = todoArrays.flat();

  console.log(`Found ${allTodos.length} TODOs:`);
  allTodos.forEach(todo => {
    console.log(`${todo.type}: ${todo.content} (${todo.file}:${todo.line})`);

    console.log(allTodos);
  });

  try {
    console.log('Syncing TODOs with API...');
    await todosApi.syncTodos(allTodos);
    console.log('TODOs synced successfully');
  } catch (err) {
    console.error('Failed to sync TODOs:', err);
  }

  const endTime = Date.now();
  console.log(`Scan completed in ${endTime - startTime}ms`);
  vscode.window.showInformationMessage(
    `Found ${allTodos.length} TODOs in ${endTime - startTime}ms`
  );
};

const getSourceFiles = async (rootPath: string): Promise<string[]> => {
  const files: string[] = [];

  const skipDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '.nuxt',
    'target',
    'bin',
    'obj',
    '__pycache__',
    '.pytest_cache',
    '.venv',
    'venv',
  ];

  const skipFiles = [
    /\.min\.(js|css)$/,
    /\.bundle\.(js|css)$/,
    /package-lock\.json$/,
    /yarn\.lock$/,
  ];

  const shouldSkipFile = (filename: string): boolean => {
    return skipFiles.some(pattern => pattern.test(filename));
  };

  const traverse = async (dir: string): Promise<void> => {
    try {
      const items = await fs.promises.readdir(dir);

      const itemPromises = items.map(async item => {
        const fullPath = path.join(dir, item);

        try {
          const stat = await fs.promises.stat(fullPath);

          if (stat.isDirectory()) {
            if (!skipDirs.includes(item)) {
              await traverse(fullPath);
            }
          } else {
            if (!shouldSkipFile(item)) {
              files.push(fullPath);
            }
          }
        } catch (error) {
          console.log(`Error processing ${fullPath}: ${error}`);
        }
      });

      await Promise.all(itemPromises);
    } catch (error) {
      console.log(`Error reading directory ${dir}: ${error}`);
    }
  };

  await traverse(rootPath);
  return files;
};

const scanFileForTodos = async (filePath: string): Promise<RawTodo[]> => {
  const todos: RawTodo[] = [];
  const todoPattern = /\/\/\s*(TODO|FIXME|HACK|NOTE|XXX)[\s:]*(.*)/gi;

  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      let match;
      while ((match = todoPattern.exec(line)) !== null) {
        todos.push({
          type: match[1].toUpperCase(),
          content: match[2].trim(),
          file: filePath,
          line: index + 1,
        });
      }
      todoPattern.lastIndex = 0;
    });
  } catch (error) {
    console.log(`Error reading file ${filePath}: ${error}`);
  }

  return todos;
};
