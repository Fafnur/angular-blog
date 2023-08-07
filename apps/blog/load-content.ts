import { config } from 'dotenv';
import * as markdown from 'markdown-it';
import { writeFileSync } from 'node:fs';
import { get } from 'node:http';
import { join } from 'node:path';
import { catchError, combineLatest, EMPTY, from, map, Observable, of, switchMap, take, tap } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ContentfulCollection, ContentfulEntity } from '@angular-blog/contentful/common';
import { ContentfulCategory, ContentfulPost } from '@angular-blog/posts/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const md = markdown();

config({
  path: 'apps/blog/.env',
});

// function castPost(
//   postDto: PostDto,
//   categories: Record<string, Entry>,
//   authors: Record<string, Entry>,
//   images: Record<string, Asset>
// ): Post {
//   return {
//     tags: postDto.metadata.tags,
//     published: postDto.fields.published ?? postDto.sys.createdAt,
//     title: postDto.fields.title,
//     description: postDto.fields.description,
//     category: {
//       slug: categories[postDto.fields.category.sys.id].fields.slug,
//       name: categories[postDto.fields.category.sys.id].fields.name,
//     },
//     image: images[postDto.fields.image.sys.id].fields.file.url,
//     author: {
//       fullName: authors[postDto.fields.author.sys.id].fields.fullName,
//     },
//     headline: postDto.fields.headline,
//     intro: postDto.fields.intro,
//     slug: postDto.fields.slug,
//     body:
//       postDto.fields.body?.length > 0
//         ? md
//             .render(postDto.fields.body)
//             .replace(/(\r\n|\n|\r)/gm, '')
//             .replace(/href/g, 'routerLink')
//         : '',
//     views: postDto.fields.views,
//     readingTime: postDto.fields.readingTime,
//   };
// }
//
// function getPostContent(post: Post): string {
//   return `  {
//     path: '${post.slug}',
//     loadComponent: () => import('@loaney/russian/posts/page').then((modules) => modules.PostPageComponent),
//     data: {
//       post: ${JSON.stringify(post)},
//       sitemap: {
//         loc: '/${post.slug}',
//       },
//       meta: {
//         title: '${post.title}',
//         description: '${post.description}',
//       },
//     },
//   }`;
// }
//
// function generateBlogRoutes(routes: string[]): void {
//   const file = `apps/russian/lk/src/app/routes/blog.routes.ts`;
//   const path = join(process.cwd(), file);
//   writeFileSync(
//     file,
//     `import { Route } from '@angular/router';\n\n/* eslint-disable max-len */\nexport const blogRoutes: Route[] = [\n${routes.join(
//       ',\n'
//     )}\n];`
//   );
// }
//
// function createPosts(data: PostsResponse): void {
//   const posts: string[] = [];
//   const categories: Record<string, Entry> = {};
//   const authors: Record<string, Entry> = {};
//   const images: Record<string, Asset> = {};
//
//   data.includes.Entry.forEach((entry) => {
//     if (entry.sys.contentType.sys.id === 'category') {
//       categories[entry.sys.id] = entry;
//     } else if (entry.sys.contentType.sys.id === 'author') {
//       authors[entry.sys.id] = entry;
//     }
//   });
//
//   data.includes.Asset.forEach((asset) => {
//     images[asset.sys.id] = asset;
//   });
//
//   data.items.forEach((postDto, index) => {
//     const post = castPost(postDto, categories, authors, images);
//     posts[index] = getPostContent(post);
//   });
//
//   generateBlogRoutes(posts);
// }

interface RequestParams {
  contentType: string;
  limit?: number;
  category?: string;
  skip?: number;
}

function getUrl(payload: RequestParams): string {
  let path = `http://cdn.contentful.com/spaces/${process.env['NX_CONTENTFUL_SPACE']}/environments/master/entries?access_token=${
    process.env['NX_CONTENTFUL_KEY']
  }&content_type=${payload.contentType}&limit=${payload.limit ?? 100}`;

  if (payload.skip) {
    path += `&skip=${payload.skip}`;
  }
  if (payload.category) {
    path += `&fields.category.sys.id=${payload.category}`;
  }

  return path;
}

function request<T extends ContentfulEntity = ContentfulEntity>(url: string): Observable<ContentfulCollection<T>> {
  return new Observable((observer) => {
    get(url, (response) => {
      const data: Uint8Array[] = [];

      response.on('data', (fragments) => data.push(fragments));

      response.on('end', () => {
        observer.next(JSON.parse(Buffer.concat(data).toString()));
        observer.complete();
      });
      response.on('error', (error) => {
        observer.error(error);
        observer.complete();
      });
    });
  });
}

function load<T extends ContentfulEntity = ContentfulEntity>(payload: RequestParams): Observable<ContentfulCollection<T>> {
  return new Observable((observer) => {
    request<T>(getUrl(payload))
      .pipe(
        switchMap((result) => {
          if (payload.limit < result.total) {
            let index = 1;
            const requests: Observable<ContentfulCollection<T>>[] = [];

            while (index * payload.limit < result.total) {
              requests.push(
                request<T>(
                  getUrl({
                    limit: payload.limit,
                    contentType: payload.contentType,
                    skip: index * payload.limit,
                  })
                )
              );
              index++;
            }

            return combineLatest(requests).pipe(
              take(1),
              map((response) => {
                return {
                  ...result,
                  items: [
                    ...result.items,
                    ...response.map((item: ContentfulCollection<T>) => item.items).reduce((a, c) => a.concat(c), []),
                  ],
                  includes: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Asset: [
                      ...result.includes.Asset,
                      ...response.map((item: ContentfulCollection<T>) => item.includes.Asset).reduce((a, c) => a.concat(c), []),
                    ],
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Entry: [
                      ...result.includes.Entry,
                      ...response.map((item: ContentfulCollection<T>) => item.includes.Entry).reduce((a, c) => a.concat(c), []),
                    ],
                  },
                } as ContentfulCollection<T>;
              })
            );
          }

          return of(result);
        }),
        tap((result) => {
          observer.next(result);
          observer.complete();
        }),
        catchError((error) => {
          observer.error(error);
          observer.complete();

          return EMPTY;
        })
      )
      .subscribe();
  });
}

function run(): void {
  // Load all posts
  load<ContentfulPost>({ contentType: 'post' })
    .pipe(
      tap((result) => {
        console.log(result.items.length);
        console.log(result.includes.Asset.length);
        console.log(result.includes.Asset.length);
      })
    )
    .subscribe();

  // Load all categories
  load<ContentfulCategory>({ contentType: 'category' })
    .pipe(
      tap((response) => {
        // TODO: Generate category
      }),
      switchMap((response) => {
        if (!response.items.length) {
          return EMPTY;
        }

        // Load all posts by category
        return combineLatest(
          response.items.map((item: ContentfulCategory) =>
            load<ContentfulPost>({
              contentType: 'post',
              category: item.sys.id,
            })
          )
        ).pipe(
          take(1),
          tap((result) => {
            // TODO: Add blog category pages
          })
        );
      })
    )
    .subscribe();
}

run();
