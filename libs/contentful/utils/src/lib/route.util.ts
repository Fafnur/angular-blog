import { Post } from '@angular-blog/posts/common';

export function getPostViewRoure(post: Post): string {
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
        image: '${post.image}',
        imageType: '${post.imageOriginal.fields.file.contentType}',
        imageWidth: '${post.imageOriginal.fields.file.details.image?.width ?? 800}',
        imageHeight: '${post.imageOriginal.fields.file.details.image?.height ?? 450}',
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

export function getPostCategoryRoute(posts: Post[], index: number, total: number): string {
  const category = posts[0].category;

  return `  {
    path: 'category/${category.slug}${index > 0 ? '/' + (index + 1) : ''}',
    loadComponent: () => import('@angular-blog/posts/page').then((modules) => modules.PostPageComponent),
    data: {
      posts: ${JSON.stringify(posts)},
      sitemap: {
        loc: '/category/${category.slug}${index > 0 ? '/' + (index + 1) : ''}',
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

export function getHomeRoute(posts: Post[], index: number, total: number): string {
  return `  {
    path: '${index > 0 ? 'feed/' + (index + 1) : ''}',
    loadComponent: () => import('@angular-blog/posts/page').then((modules) => modules.PostPageComponent),
    data: {
      posts: ${JSON.stringify(posts)},
      sitemap: {
        loc: '${index > 0 ? '/feed/' + (index + 1) : '/'}',
      },
      meta: {
        title: 'Новости от ${new Date().toLocaleDateString()}',
        description: 'Последние новости на сайте',
      },
      breadcrumbs: [
        {
          label: 'Блог',
          route: '/',
        },
      ],
      pagination: {
        page: ${index + 1},
        total: ${total},
        route: '/feed',
      },
    },
  }`;
}
