import { config } from 'dotenv';

import { generate } from '@angular-blog/contentful/utils';

config({
  path: 'apps/blog/.env',
});

generate({
  categoryPath: 'libs/ui/categories/src/lib/categories.ts',
  postsPath: 'apps/blog/src/app/routes/blog.routes.ts',
});
