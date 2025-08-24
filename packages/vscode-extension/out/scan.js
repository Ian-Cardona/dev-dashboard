'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.scanTodos = void 0;
const vscode = __importStar(require('vscode'));
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
const todosApi_1 = require('./todosApi');
const scanTodos = async () => {
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
  const allTodos = todoArrays.flat();
  console.log(`Found ${allTodos.length} TODOs:`);
  allTodos.forEach(todo => {
    console.log(`${todo.type}: ${todo.content} (${todo.file}:${todo.line})`);
    console.log(allTodos);
  });
  try {
    console.log('Syncing TODOs with API...');
    await todosApi_1.todosApi.syncTodos(allTodos);
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
exports.scanTodos = scanTodos;
const getSourceFiles = async rootPath => {
  const files = [];
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
  const shouldSkipFile = filename => {
    return skipFiles.some(pattern => pattern.test(filename));
  };
  const traverse = async dir => {
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
const scanFileForTodos = async filePath => {
  const todos = [];
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
