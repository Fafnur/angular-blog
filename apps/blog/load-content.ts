import { config } from 'dotenv';
import * as markdown from 'markdown-it';
import { writeFileSync } from 'node:fs';
import { get } from 'node:http';
import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

import { ContentfulCollection, ContentfulEntity } from '@angular-blog/contentful/common';
import { Category, ContentfulCategory, ContentfulPost, Post } from '@angular-blog/posts/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const md = markdown();

config({
  path: 'apps/blog/.env',
});

function getPostContent(post: Post): string {
  return `  {
    path: '${post.slug}',
    loadComponent: () => import('@angular-blog/posts/view/page').then((modules) => modules.PostViewPageComponent),
    data: {
      post: ${JSON.stringify(post)},
      sitemap: {
        loc: '/${post.slug}',
      },
      meta: {
        title: '${post.title}',
        description: '${post.description}',
      },
      breadcrumbs: [
        {
          label: 'Блог',
          route: '/',
        },
        {
          label: '${post.category.name}',
          route: '/category/${post.category.slug}',
        },
      ],
    },
  }`;
}

function getCategoryPostContent(category: Category, posts: Post[], index: number, total: number): string {
  return `  {
    path: '/category/${category.slug}${index > 0 ? '/' + (index + 1) : ''}',
    loadComponent: () => import('@angular-blog/posts/page').then((modules) => modules.PostPageComponent),
    data: {
      posts: ${JSON.stringify(posts)},
      sitemap: {
        loc: '/category/${category.slug}${index > 0 ? '/' + index : ''}',
      },
      meta: {
        title: '${category.name} от ${new Date().toLocaleDateString()}',
        description: 'Последние новости в категории: ${category.name}',
      },
      breadcrumbs: [
        {
          label: 'Блог',
          route: '/',
        },
        {
          label: '${category.name}',
          route: '/category/${category.slug}',
        },
      ],
      pagination: {
        page: ${index + 1},
        total: ${total},
        route: '/category/${category.slug}',
      },
    },
  }`;
}

function writePosts(routes: string[]): void {
  const file = `apps/blog/src/app/routes/blog-posts.routes.ts`;

  writeFileSync(
    file,
    `import { Route } from '@angular/router';\n\n/* eslint-disable max-len */\nexport const blogRoutes: Route[] = [\n${routes.join(
      ',\n'
    )}\n];`
  );
}
function writeCategoryPosts(routes: string[]): void {
  const file = `apps/blog/src/app/routes/blog-categories.routes.ts`;

  writeFileSync(
    file,
    `import { Route } from '@angular/router';\n\n/* eslint-disable max-len */\nexport const blogRoutes: Route[] = [\n${routes.join(
      ',\n'
    )}\n];`
  );
}

function writeCategories(categories: Category[]): void {
  const file = `libs/ui/categories/src/lib/categories.ts`;

  writeFileSync(
    file,
    // eslint-disable-next-line max-len
    `import { Category } from '@angular-blog/posts/common';\n\n/* eslint-disable max-len */\nexport const categories: Category[] = ${JSON.stringify(
      categories
    )};`
  );
}

function castPost(
  postDto: ContentfulPost,
  categories: Record<string, ContentfulEntity>,
  authors: Record<string, ContentfulEntity>,
  images: Record<string, ContentfulEntity>
): Post {
  return {
    tags: postDto.metadata.tags,
    published: postDto.fields.published ?? postDto.sys.createdAt,
    title: postDto.fields.title,
    description: postDto.fields.description,
    category: {
      slug: categories[postDto.fields.category.sys.id].fields.slug,
      name: categories[postDto.fields.category.sys.id].fields.name,
    },
    image: images[postDto.fields.image.sys.id].fields.file.url,
    author: {
      fullName: authors[postDto.fields.author.sys.id].fields.fullName,
      email: authors[postDto.fields.author.sys.id].fields.email,
      avatar: authors[postDto.fields.author.sys.id].fields.avatar,
      bio: authors[postDto.fields.author.sys.id].fields.bio,
    },
    headline: postDto.fields.headline,
    intro: postDto.fields.intro,
    slug: postDto.fields.slug,
    body:
      postDto.fields.body?.length > 0
        ? md
            .render(postDto.fields.body)
            .replace(/(\r\n|\n|\r)/gm, '')
            .replace(/href/g, 'routerLink')
        : '',
    views: postDto.fields.views,
    readingTime: postDto.fields.readingTime,
  };
}

function createPosts(data: ContentfulCollection<ContentfulPost>): void {
  const posts: string[] = [];
  const categories: Record<string, ContentfulEntity> = {};
  const authors: Record<string, ContentfulEntity> = {};
  const images: Record<string, ContentfulEntity> = {};

  data.includes.Entry.forEach((entry) => {
    if (entry.sys.contentType.sys.id === 'category') {
      categories[entry.sys.id] = entry;
    } else if (entry.sys.contentType.sys.id === 'author') {
      authors[entry.sys.id] = entry;
    }
  });

  data.includes.Asset.forEach((asset) => {
    images[asset.sys.id] = asset;
  });

  data.items.forEach((postDto, index) => {
    const post = castPost(postDto, categories, authors, images);
    posts[index] = getPostContent(post);
  });

  writePosts(posts);
}

export function createCategoryPosts(data: ContentfulCollection<ContentfulPost>): string[] {
  const posts: string[] = [];
  const categories: Record<string, ContentfulEntity> = {};
  const authors: Record<string, ContentfulEntity> = {};
  const images: Record<string, ContentfulEntity> = {};

  data.includes.Entry.forEach((entry) => {
    if (entry.sys.contentType.sys.id === 'category') {
      categories[entry.sys.id] = entry;
    } else if (entry.sys.contentType.sys.id === 'author') {
      authors[entry.sys.id] = entry;
    }
  });

  data.includes.Asset.forEach((asset) => {
    images[asset.sys.id] = asset;
  });

  if (data.items.length > 0) {
    const postsEntities: Post[] = data.items.map((item) => castPost(item, categories, authors, images));
    const limit = 3;
    const total = postsEntities.length;

    for (let index = 0; index * limit < total; index++) {
      posts[index] = getCategoryPostContent(
        postsEntities[0].category,
        postsEntities.slice(index * limit, limit),
        index,
        Math.ceil(total / limit)
      );
    }
  }

  return posts;
}

export function createCategoriesPosts(data: ContentfulCollection<ContentfulPost>[]): void {
  const posts: string[] = [];

  data.forEach((item) => {
    if (item.items.length > 0) {
      posts.push(...createCategoryPosts(item));
    }
  });

  writeCategoryPosts(posts);
}

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
        createPosts(result);
      })
    )
    .subscribe();

  // Load all categories
  load<ContentfulCategory>({ contentType: 'category' })
    .pipe(
      tap((response: ContentfulCollection<ContentfulCategory>) => {
        const categories: Category[] = response.items.map((item) => ({ name: item.fields.name, slug: item.fields.slug }));

        writeCategories(categories);
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
          tap((result: ContentfulCollection<ContentfulPost>[]) => {
            createCategoriesPosts(result);
          })
        );
      })
    )
    .subscribe();
}

run();
