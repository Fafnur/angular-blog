import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

import { GoogleAnalyticsEvent, GoogleAnalyticsNavigation, GoogleAnalyticsService } from './google-analytics.service';
import { YandexMetrikaService } from './yandex-metrika.service';

/**
 * Metric options interface for send event
 * @publicApi
 */
export interface MetricOptions {
  /**
   * Yandex Metrika options
   */
  readonly ym: object;

  /**
   * Google Analytics options
   */
  readonly ga: GoogleAnalyticsEvent;
}

/**
 * Metric navigation interface for navigation
 * @publicApi
 */
export interface MetricNavigation {
  /**
   * Yandex Metrika options
   */
  readonly ym: object;

  /**
   * Google Analytics options
   */
  readonly ga: GoogleAnalyticsNavigation;
}

function isMetricOptions(options?: object | Partial<MetricOptions>): options is Partial<MetricOptions> {
  if (!options) {
    return false;
  }

  return (options as Partial<MetricOptions>).ym !== undefined || (options as Partial<MetricOptions>).ga !== undefined;
}

function isMetricNavigation(options?: object | Partial<MetricNavigation>): options is Partial<MetricNavigation> {
  if (!options) {
    return false;
  }

  return (options as Partial<MetricNavigation>).ym !== undefined || (options as Partial<MetricNavigation>).ga !== undefined;
}

/**
 * Service for send all metrics.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * First, add script in index.html for Google Analytics and Yandex Metrika.
 *
 * Second, add service on component and send event.
 *
 * ```
 * @Component({})
 * export class SimpleComponent {
 *   constructor(private readonly metricService: MetricService) {}
 *
 *   onSubmit(): void {
 *     this.metricService.send('submit', { ym: { user: 1 }, ga: { customerId: 1 } });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MetricService {
  constructor(
    private readonly ym: YandexMetrikaService,
    private readonly ga: GoogleAnalyticsService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        tap((event) => this.navigation(event.urlAfterRedirects)),
      )
      .subscribe();
  }

  init(): void {
    /* empty */
  }

  /**
   * Send change SPA page
   *
   * @param url A new url
   * @param options Additional options
   */
  navigation(url: string, options?: object | Partial<MetricNavigation>): void {
    this.ym.hit(url, isMetricNavigation(options) ? options.ym : options);
    this.ga.sendNavigation(url, isMetricNavigation(options) ? options.ga : options);
  }

  /**
   * Send analytic event
   *
   * @param action Action name
   * @param options Action options
   */
  send(action: string, options?: object | Partial<MetricOptions>): void {
    this.ym.reachGoal(action, isMetricOptions(options) ? options.ym : options);
    this.ga.sendEvent(action, isMetricOptions(options) ? options.ga : options);
  }
}
