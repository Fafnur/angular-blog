import { output } from '@nx/workspace';
import { writeFileSync, existsSync, readdirSync, readFileSync, lstatSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Find file on folders
 */
function fromDir(startPath: string, filter: string): string[] {
  if (!existsSync(startPath)) {
    console.warn('no dir ', startPath);
    return [];
  }
  const founded = [];
  const files = readdirSync(startPath);
  for (const file of files) {
    const filename = join(startPath, file);
    const stat = lstatSync(filename);
    if (stat.isDirectory()) {
      const foundedIn = fromDir(filename, filter);
      founded.push(...foundedIn);
    } else if (filename.indexOf(filter) >= 0) {
      founded.push(filename);
    }
  }

  return founded;
}

function run(project: string): void {
  let files = fromDir(`./dist/apps/${project}/browser/ru`, 'index.html');

  files = files.filter((file) => file.indexOf('/browser/ru/light') < 0);

  if (!existsSync(`./dist/apps/${project}/browser/ru/light`)) {
    mkdirSync(`./dist/apps/${project}/browser/ru/light`);
  }

  for (const file of files) {
    const fileContent = readFileSync(file, 'utf8');
    const data = fileContent.replace('<html', '<html data-theme="light"');
    const folders = file.slice(file.indexOf('/ru') + 4, -11);

    if (folders.length) {
      const dirs = folders.split('/');

      dirs.forEach((dir, index, arr) => {
        const dirPath = join(`./dist/apps/${project}/browser/ru/light`, ...arr.slice(0, index + 1));
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath);
        }
      });
    }

    writeFileSync(file.replace('browser/ru', 'browser/ru/light'), data);
  }

  output.log({ title: `Successfully ran target light mode for project ${project}` });
  console.log(files);
}

run(process.env.PROJECT ?? 'blog');
