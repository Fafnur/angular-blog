import { ContentfulEntity, ContentfulSys } from '@angular-blog/contentful/common';

/**
 * Category entity
 */
export interface Category {
  /**
   * Name
   */
  readonly name: string;

  /**
   * Slug
   */
  readonly slug: string;
}

/**
 * Category DTO
 */
export type ContentfulCategory = ContentfulEntity<Category>;

/**
 * Author entity
 */
export interface Author {
  /**
   * Full name
   */
  readonly fullName: string;

  /**
   * Email
   */
  readonly email?: string;
}

/**
 * Author DTO
 */
export type ContentfulAuthor = ContentfulEntity<Author>;

/**
 * Post DTO
 */
export type ContentfulPost = ContentfulEntity<{
  /**
   * Meta title
   */
  readonly title: string;

  /**
   * Meta description
   */
  readonly description: string;

  /**
   * Category sys link
   */
  readonly category: {
    readonly sys: ContentfulSys;
  };

  /**
   * Image sys link
   */
  readonly image: {
    readonly sys: ContentfulSys;
  };

  /**
   * Author sys link
   */
  readonly author: {
    readonly sys: ContentfulSys;
  };

  /**
   * Title
   */
  readonly headline: string;

  /**
   * Intro
   */
  readonly intro: string;

  /**
   * Slug
   */
  readonly slug: string;

  /**
   * Body
   */
  readonly body: string;

  /**
   * Published date
   */
  readonly published?: string;

  /**
   * Count views
   */
  readonly views?: number;

  /**
   * Reading time in minutes
   */
  readonly readingTime?: number;
}>;

/**
 * Post entity for blog
 */
export interface Post {
  /**
   * Tags
   */
  readonly tags: string[];

  /**
   * Published date
   */
  readonly published: string;

  /**
   * Meta title
   */
  readonly title: string;

  /**
   * Meta description
   */
  readonly description: string;

  /**
   * Category
   */
  readonly category: Category;

  /**
   * Path to image
   */
  readonly image: string;

  /**
   * Author
   */
  readonly author: Author;

  /**
   * Title
   */
  readonly headline: string;

  /**
   * Intro
   */
  readonly intro: string;

  /**
   * Slug
   */
  readonly slug: string;

  /**
   * Body
   */
  readonly body: string;

  /**
   * Count views
   */
  readonly views?: number;

  /**
   * Reading time in minutes
   */
  readonly readingTime?: number;
}
