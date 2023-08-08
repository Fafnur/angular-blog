import { combineLatest, switchMap, take, tap } from 'rxjs';

import { ContentfulCollection } from '@angular-blog/contentful/common';
import { ContentfulCategory, ContentfulPost } from '@angular-blog/posts/common';

import { createRoutes } from './create.util';
import { load } from './load.util';
import { getHomeRoute, getPostCategoryRoute, getPostViewRoure } from './route.util';
import { generateSitemap } from './sitemap.util';
import { writeCategories, writeRoutes } from './write.util';

export function generate(payload: { readonly categoryPath: string; readonly postsPath: string; readonly pageLimit?: number }): void {
  const categories: Record<string, Record<string, string>> = {};

  load<ContentfulCategory>({ contentType: 'category' })
    .pipe(
      tap((response) =>
        response.items.forEach((item) => {
          categories[item.sys.id] = {
            name: item.fields.name,
            slug: item.fields.slug,
          };
        })
      ),
      switchMap((response) => {
        const requests = [load<ContentfulPost>({ contentType: 'post' })];

        if (response.items.length > 0) {
          requests.push(
            ...response.items.map((item) =>
              load<ContentfulPost>({
                contentType: 'post',
                category: item.sys.id,
              })
            )
          );
        }

        // First, we will load all posts, second we will load posts by category
        return combineLatest(requests);
      }),
      take(1),
      tap((result: ContentfulCollection<ContentfulPost>[]) => {
        const categoriesWithPosts: Record<string, any>[] = [];

        const routes = result
          .map((data, index) => {
            if (index === 0) {
              return createRoutes({
                data,
                template: getHomeRoute,
                templateView: getPostViewRoure,
                limit: payload.pageLimit,
              });
            }

            if (data.items.length > 0) {
              const category = categories[data.items[0].fields.category.sys.id];

              if (category) {
                categoriesWithPosts.push(category);
              }
            }

            return createRoutes({
              data,
              template: getPostCategoryRoute,
              limit: payload.pageLimit,
            });
          })
          .reduce((acc: string[], current: string[]) => acc.concat(current), [] as string[]);

        // Write posts
        writeRoutes(payload.postsPath, routes);

        // Write categories for menu
        writeCategories(payload.categoryPath, categoriesWithPosts);

        // Generate sitemap and routes for prerender
        generateSitemap('blog');
      })
    )
    .subscribe();
}
