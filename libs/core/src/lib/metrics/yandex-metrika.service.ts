import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    /**
     * YandexMetrika
     */
    readonly ym?: (...params: unknown[]) => void;
  }
}

/**
 * Yandex metrika config
 * @publicApi
 */
export interface YandexMetrikaConfig {
  /**
   * Counter
   */
  counter: string | number | null;

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
export const YANDEX_METRIKA_CONFIG = new InjectionToken<Partial<YandexMetrikaConfig>>('YANDEX_METRIKA_CONFIG');

/**
 * Service for Yandex Metrika
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * First, add script in index.html:
 *
 * ```
 * <!DOCTYPE html>
 * <html lang="en">
 *   <head>
 *     <meta charset="utf-8" />
 *     <script>
 *       (function (m, e, t, r, i, k, a) {
 *         m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
 *         m[i].l = 1 * new Date();
 *         (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]), (k.async = 1), (k.src = r), a.parentNode.insertBefore(k, a);
 *       })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
 *
 *       ym(<YOUR_COUNTER>, 'init', {
 *         clickmap: true,
 *         trackLinks: true,
 *         accurateTrackBounce: true,
 *         webvisor: true,
 *         ecommerce: 'dataLayer',
 *       });
 *     </script>
 *   </head>
 *   <body>
 *     <app-root> </app-root>
 *   </body>
 * </html>
 * ```
 *
 * Then, you can send hit and reachGoal
 *
 * ```
 * @Component({})
 * export class SimpleComponent {
 *   constructor(private readonly yandexMetrikaService: YandexMetrikaService) {}
 *
 *   onSubmit(): void {
 *     this.yandexMetrikaService.reachGoal('submit');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class YandexMetrikaService {
  /**
   * Yandex metrika config
   * @private
   */
  private readonly config: YandexMetrikaConfig;

  /**
   * Counter
   * @private
   */
  private readonly counter: (...params: unknown[]) => void;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(YANDEX_METRIKA_CONFIG) config: Partial<YandexMetrikaConfig> | null
  ) {
    this.config = {
      ...config,
      counter: null,
      paths: config?.paths ?? [],
      domains: config?.domains ?? [],
    };

    if (isPlatformBrowser(this.platformId) && typeof this.document.defaultView?.ym !== 'undefined' && !!this.config.counter) {
      this.counter = this.document.defaultView.ym;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.counter = () => {};
    }
  }

  /**
   * Sent hit
   *
   * @param url Url page
   * @param options Options for hit
   */
  hit(url: string, options?: Record<string, unknown>): void {
    let clearReferrer = false;
    if (
      !this.config.domains.every((domain) => this.document.referrer.indexOf(domain) < 0) ||
      !this.config.paths.every((path) => this.document.location.pathname.indexOf(path) < 0)
    ) {
      clearReferrer = true;
    }

    const optionsAll: { referer?: string } = { ...options };
    if (clearReferrer) {
      optionsAll.referer = '';
    }
    this.counter(this.config.counter, 'hit', url, optionsAll);
  }

  /**
   * Sent reachGoal
   *
   * @param target Target name
   * @param options Options for hit
   */
  reachGoal(target: string, options?: Record<string, unknown>): void {
    this.counter(this.config.counter, 'reachGoal', target, options);
  }
}
