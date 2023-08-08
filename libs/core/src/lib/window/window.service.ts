import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Service that returns a reference to the window contained in the document.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * For browser applications, you can just use the service:
 *
 * ```
 * @Component({})
 * class YourComponent {
 *   constructor(private readonly windowService: WindowService) {
 *     const window = this.windowService.window;
 *   }
 * }
 * ```
 *
 * For Angular applications with Server-Side Rendering (SSR), нou must check the platform:
 *
 * ```
 * @Component({})
 * class YourComponent {
 *   constructor(
 *     @Inject(PLATFORM_ID) private readonly platformId: Object,
 *     private readonly windowService: WindowService
 *   ) {
 *     if (isPlatformBrowser(this.platformId)) {
 *       const window = this.windowService.window;
 *     }
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  /**
   * Reference to the document contained in the window.
   */
  readonly document: Document;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document;
  }

  /**
   * The window object
   */
  get window(): Window {
    const window = this.document.defaultView;

    if (window === null) {
      throw new Error('Default view is not defined!');
    }

    return window;
  }
}
