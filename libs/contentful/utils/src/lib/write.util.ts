import { writeFileSync } from 'node:fs';

export function writeRoutes(fileName: string, routes: string[]): void {
  writeFileSync(
    fileName,
    `import { Route } from '@angular/router';\n\n/* eslint-disable max-len */\nexport const blogRoutes: Route[] = [\n${routes.join(
      ',\n'
    )}\n];`
  );
}

export function writeCategories(fileName: string, categories: Record<string, any>[]): void {
  writeFileSync(
    fileName,
    // eslint-disable-next-line max-len
    `import { Category } from '@angular-blog/posts/common';\n\n/* eslint-disable max-len */\nexport const categories: Category[] = ${JSON.stringify(
      categories
    )};`
  );
}
