import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

declare global {
  interface Window {
    /**
     * GTag
     */
    readonly gtag?: (...params: unknown[]) => void;
  }
}

/**
 * GA config
 * @publicApi
 */
export interface GoogleAnalyticsConfig {
  /**
   * Google Analytics uid collection
   */
  ids: string[];

  /**
   * Google Analytics uid for webview
   */
  idsWebview: string[];

  /**
   * Domains for reset referer
   */
  domains: string[];

  /**
   * Paths for reset referer
   */
  paths: string[];
}

/**
 * InjectionToken for yandex metrika config
 * @publicApi
 */
export const GA_CONFIG = new InjectionToken<Partial<GoogleAnalyticsConfig>>('GoogleAnalyticsConfig');

/**
 * Google Analytics event interface
 * @publicApi
 */
export interface GoogleAnalyticsEvent<T = unknown> {
  /**
   * Event category
   */
  eventCategory: string;

  /**
   * Event value
   */
  eventLabel: string;

  /**
   * Event value
   */
  eventValue: T;
}

/**
 * Google Analytics navigation interface
 * @publicApi
 */
export interface GoogleAnalyticsNavigation {
  [key: string]: unknown;

  /**
   * Page title
   */
  title: string;

  /**
   * Current platform (web or app)
   */
  platform: string;

  /**
   * Current application store (google play, app store, xiaomi, ...)
   */
  appstore: string;

  /**
   * Customer ID
   */
  customerId: string;
}

/**
 * Service for send all metrics.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * First, add script in index.html for Google Analytics.
 *
 * ```
 * <!DOCTYPE html>
 * <html lang="en">
 *   <head>
 *     <meta charset="utf-8" />
 *     <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_TAG"></script>
 *     <script>
 *       window.dataLayer = window.dataLayer || [];
 *       function gtag() {
 *         dataLayer.push(arguments);
 *       }
 *       gtag('js', new Date());
 *     </script>
 *   </head>
 *   <body>
 *     <app-root></app-root>
 *   </body>
 * </html>
 * ```
 *
 * Second, set config on AppModule:
 *
 * ```
 * @NgModule({
 *   providers: [
 *     {
 *       provide: GA_CONFIG,
 *       useValue: {
 *         ids: ['MY-ID-1', 'MY-ID-2'],
 *         idsWebview: ['MY-ID-1'],
 *       } as Partial<GoogleAnalyticsConfig>,
 *     },
 *   ],
 * })
 * export class AppCoreModule {}
 * ```
 *
 * Third, add service on component and send event.
 *
 * ```
 * @Component({})
 * export class SimpleComponent {
 *   constructor(private readonly googleAnalyticsService: GoogleAnalyticsService) {}
 *
 *   onSubmit(): void {
 *     this.googleAnalyticsService.sendEvent('submit', { eventLabel: 'Registration' });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  /**
   * GA config
   */
  readonly config: GoogleAnalyticsConfig;

  /**
   * Gtag function
   */
  readonly gtag: (...params: unknown[]) => void;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(GA_CONFIG) config: Partial<GoogleAnalyticsConfig> | null,
  ) {
    this.config = {
      ids: config?.ids ?? [],
      idsWebview: config?.idsWebview ?? [],
      paths: config?.paths ?? [],
      domains: config?.domains ?? [],
    };

    if (typeof this.document.defaultView?.gtag !== 'undefined' && this.config.ids.length > 0) {
      this.gtag = this.document.defaultView.gtag;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.gtag = () => {};
    }
  }

  /**
   * Set config for GA
   *
   * @param payload Payload with data
   */
  set(payload: object): void {
    this.gtag('set', payload);
  }

  /**
   * Send Google Analytic event
   *
   * @param action Event name
   * @param payload Payload
   * @param values Custom values for GA
   * @param data Custom data on GA
   */
  sendEvent(action: string, payload?: Partial<GoogleAnalyticsEvent>, values?: object, data?: unknown): void {
    /* eslint-disable @typescript-eslint/naming-convention */
    this.gtag(
      'event',
      action,
      {
        event_category: payload?.eventCategory,
        event_label: payload?.eventLabel,
        value: payload?.eventValue,
        ...values,
      },
      data,
    );
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  /**
   * Change SPA page
   *
   * @param url A new URL
   * @param options GA options
   */
  sendNavigation(url: string, options?: Partial<GoogleAnalyticsNavigation>): void {
    if (
      !this.config.domains.every((domain) => this.document.referrer.indexOf(domain) < 0) ||
      !this.config.paths.every((path) => this.document.location.pathname.indexOf(path) < 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.set({ page_referrer: this.document.defaultView?.location.origin ?? '' });
    }
    if (options?.platform && options?.appstore) {
      this.set({ dimension3: options.platform, dimension4: options.appstore });
    }

    for (const key of this.config.ids) {
      /* eslint-disable @typescript-eslint/naming-convention */
      this.gtag('config', key, {
        page_title: options?.title,
        page_path: url,
        user_id: options?.customerId,
      });
      /* eslint-enable @typescript-eslint/naming-convention */
    }
  }
}
