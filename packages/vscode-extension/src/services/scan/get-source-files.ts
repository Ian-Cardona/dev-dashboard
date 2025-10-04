import * as fs from 'fs';
import * as path from 'path';

export const getSourceFiles = async (rootPath: string): Promise<string[]> => {
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
          const stat = await fs.promises.lstat(fullPath);

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
