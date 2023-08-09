import { writeFileSync } from 'node:fs';

import { getRouteSeparate } from './route.util';

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

export function writeRoutesSeparate(fileName: string, routes: string[]): void {
  const separateRoutes: string[] = [];

  routes.forEach((route, index) => {
    writeRoutes(`apps/blog/src/app/routes/blog-${index}.routes.ts`, [route]);
    const match = route.match(/loc: '.+?'/);
    const path = match ? match[0].slice(7, -1) : '';

    separateRoutes.push(getRouteSeparate(path, index));
  });

  writeRoutes(fileName, separateRoutes);
}
