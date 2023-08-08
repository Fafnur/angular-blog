import * as markdown from 'markdown-it';

import { ContentfulAsset, ContentfulCollection } from '@angular-blog/contentful/common';
import { ContentfulAuthor, ContentfulCategory, ContentfulPost, Post } from '@angular-blog/posts/common';

const md = markdown();

export function castPost(
  postDto: ContentfulPost,
  categories: Record<string, ContentfulCategory>,
  authors: Record<string, ContentfulAuthor>,
  images: Record<string, ContentfulAsset>
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
    imageOriginal: images[postDto.fields.image.sys.id],
    author: {
      fullName: authors[postDto.fields.author.sys.id].fields.fullName,
      email: authors[postDto.fields.author.sys.id].fields.email,
      avatar: images[authors[postDto.fields.author.sys.id].fields.avatar.sys.id].fields.file.url,
      bio: authors[postDto.fields.author.sys.id].fields.bio,
    },
    headline: postDto.fields.headline,
    intro: postDto.fields.intro,
    slug: postDto.fields.slug,
    body: postDto.fields.body?.length > 0 ? md.render(postDto.fields.body).replace(/(\r\n|\n|\r)/gm, '') : '',
    views: postDto.fields.views,
    readingTime: postDto.fields.readingTime,
  };
}

export function castPosts(data: ContentfulCollection<ContentfulPost>): Post[] {
  const categories: Record<string, ContentfulCategory> = {};
  const authors: Record<string, ContentfulAuthor> = {};
  const images: Record<string, ContentfulAsset> = {};

  if (data.includes) {
    data.includes.Entry.forEach((entry) => {
      if (entry.sys.contentType.sys.id === 'category') {
        categories[entry.sys.id] = entry as ContentfulCategory;
      } else if (entry.sys.contentType.sys.id === 'author') {
        authors[entry.sys.id] = entry as ContentfulAuthor;
      }
    });

    data.includes.Asset.forEach((asset) => {
      images[asset.sys.id] = asset as ContentfulAsset;
    });
  }

  return data.items.map((item) => castPost(item, categories, authors, images));
}
