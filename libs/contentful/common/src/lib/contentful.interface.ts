/**
 * Contentful system
 */
export interface ContentfulSys {
  /**
   * System type ("link")
   */
  readonly type: string;

  /**
   * Link type ("ContentType")
   */
  readonly linkType: string;

  /**
   * Name ("post" | "category" | ...)
   */
  readonly id: string;
}

/**
 * Contentful entity
 */
export interface ContentfulEntity<T extends object = object> {
  /**
   * Metadata
   */
  readonly metadata: {
    /**
     * Tags
     */
    readonly tags: [];
  };

  /**
   * System
   */
  readonly sys: {
    /**
     * Space (master|stage|testing|...)
     */
    readonly space: {
      readonly sys: ContentfulSys;
    };

    /**
     * UUID
     */
    readonly id: string;

    /**
     * System type
     */
    readonly type: string;

    /**
     * Created date
     */
    readonly createdAt: string;

    /**
     * Updated date
     */
    readonly updatedAt: string;

    /**
     * Environment for space
     */
    readonly environment: {
      readonly sys: ContentfulSys;
    };

    /**
     * Revision
     */
    readonly revision: number;

    /**
     * ContentType
     */
    readonly contentType: {
      readonly sys: ContentfulSys;
    };

    /**
     * Locale
     */
    readonly locale: string;
  };

  /**
   * Entity fields
   */
  readonly fields: T;
}

/**
 * Contentful Asset
 */
export type ContentfulAsset = ContentfulEntity<{
  /**
   * Title
   */
  readonly title: string;

  /**
   * File
   */
  readonly file: {
    /**
     * Original url
     */
    readonly url: string;

    /**
     * Details
     */
    readonly details: {
      /**
       * File size
       */
      readonly size: number;

      /**
       * Image props
       */
      readonly image?: {
        readonly width: number;
        readonly height: number;
      };
    };

    /**
     * File name
     */
    readonly fileName: string;

    /**
     * Content type
     */
    readonly contentType: string;
  };
}>;

/**
 * Contentful collection
 */
export interface ContentfulCollection<T extends ContentfulEntity = ContentfulEntity> {
  /**
   * System
   */
  readonly sys: ContentfulSys;

  /**
   * Total
   */
  readonly total: number;

  /**
   * Skip
   */
  readonly skip: number;

  /**
   * Limit
   */
  readonly limit: number;

  /**
   * Items
   */
  readonly items: T[];

  /* eslint-disable @typescript-eslint/naming-convention */
  /**
   * Includes entities
   */
  readonly includes?: {
    /**
     * Entities
     */
    readonly Entry: ContentfulEntity[];

    /**
     * Assets
     */
    readonly Asset: ContentfulAsset[];
  };
  /* eslint-enable @typescript-eslint/naming-convention */
}
