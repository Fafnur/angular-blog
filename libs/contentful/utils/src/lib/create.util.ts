import { ContentfulCollection } from '@angular-blog/contentful/common';
import { ContentfulPost, Post } from '@angular-blog/posts/common';

import { castPosts } from './cast.util';

export interface RoutePayload {
  readonly data: ContentfulCollection<ContentfulPost>;
  readonly template: (posts: Post[], index: number, total: number) => string;
  readonly templateView?: (post: Post) => string;
  readonly limit?: number;
}

export function createRoutes(payload: RoutePayload): string[] {
  const routes: string[] = [];
  const posts: Post[] = castPosts(payload.data);

  const total = posts.length;
  const limit = payload.limit ?? 4;

  for (let index = 0; index * limit < posts.length; index++) {
    routes.push(payload.template(posts.slice(index * limit, (index + 1) * limit), index, Math.ceil(total / limit)));
  }

  const templateView = payload.templateView;
  if (typeof templateView === 'function') {
    posts.forEach((post) => {
      routes.push(templateView(post));
    });
  }

  // writeRoutes(payload.fileName, routes);
  return routes;
}
