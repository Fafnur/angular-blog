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
  readonly email: string;

  /**
   * Bio
   */
  readonly bio?: string;

  /**
   * Avatar
   */
  readonly avatar: string;
}

/**
 * Author DTO
 */
export type ContentfulAuthor = ContentfulEntity<
  Omit<Author, 'avatar'> & {
    /**
     * Avatar asset
     */
    readonly avatar: {
      readonly sys: ContentfulSys;
    };
  }
>;

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

/**
 * Post DTO
 */
export type ContentfulPost = ContentfulEntity<
  Omit<Post, 'category' | 'image' | 'author' | 'tags'> & {
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
  }
>;
