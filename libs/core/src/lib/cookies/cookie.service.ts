import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private readonly platform: Platform, @Inject(DOCUMENT) private readonly document: Document) {}

  get(name: string): string | null {
    if (!this.platform.isBrowser) {
      return null;
    }
    // eslint-disable-next-line no-useless-escape
    const matches = this.document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));

    return matches ? decodeURIComponent(matches[1]) : null;
  }

  set(
    name: string,
    value: string,
    options?: Partial<{ expires: Date; path: string; domain: string; secure: string; sameSite: string }>
  ): void {
    if (this.platform.isBrowser) {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;
      const expires = options?.expires ?? new Date('01 Jun 2037 00:00:00 PDT');
      cookieString += 'expires=' + expires.toUTCString() + ';';

      if (options?.path) {
        cookieString += 'path=' + options.path + ';';
      }

      const domain = options?.domain ?? `.${window.location.hostname}`;
      cookieString += 'domain=' + domain + ';';

      if (options?.sameSite) {
        cookieString += 'sameSite=' + options.sameSite + ';';
      } else {
        cookieString += 'sameSite=None;';
      }
      cookieString += 'secure;';

      this.document.cookie = cookieString;
    }
  }
}
