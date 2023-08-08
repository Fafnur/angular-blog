import { get } from 'node:http';
import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

import { ContentfulCollection, ContentfulEntity } from '@angular-blog/contentful/common';

export interface RequestParams {
  readonly contentType: string;
  readonly limit?: number;
  readonly category?: string;
  readonly skip?: number;
}

export const REQUEST_LIMIT = 100;

export function getUrl(payload: RequestParams): string {
  let path = `http://cdn.contentful.com/spaces/${process.env['NX_CONTENTFUL_SPACE']}/environments/master/entries?access_token=${
    process.env['NX_CONTENTFUL_KEY']
  }&content_type=${payload.contentType}&limit=${payload.limit ?? REQUEST_LIMIT}`;

  if (payload.skip) {
    path += `&skip=${payload.skip}`;
  }
  if (payload.category) {
    path += `&fields.category.sys.id=${payload.category}`;
  }

  return path;
}

export function request<T extends ContentfulEntity = ContentfulEntity>(url: string): Observable<ContentfulCollection<T>> {
  return new Observable((observer) => {
    get(url, (response) => {
      const data: Uint8Array[] = [];

      response.on('data', (fragments) => data.push(fragments));

      response.on('end', () => {
        observer.next(JSON.parse(Buffer.concat(data).toString()) as ContentfulCollection<T>);
        observer.complete();
      });
      response.on('error', (error) => {
        observer.error(error);
        observer.complete();
      });
    });
  });
}

export function load<T extends ContentfulEntity = ContentfulEntity>(payload: RequestParams): Observable<ContentfulCollection<T>> {
  const limit = payload.limit ?? REQUEST_LIMIT;

  return new Observable((observer) => {
    request<T>(getUrl(payload))
      .pipe(
        switchMap((result) => {
          if (limit < result.total) {
            let index = 1;
            const requests = [];

            while (index * limit < result.total) {
              requests.push(
                request<T>(
                  getUrl({
                    limit: payload.limit,
                    contentType: payload.contentType,
                    skip: index * limit,
                  })
                )
              );
              index++;
            }
            /* eslint-disable @typescript-eslint/naming-convention */
            return combineLatest(requests).pipe(
              take(1),
              map((response) => {
                return {
                  ...result,
                  items: [...result.items, ...response.map((item) => item.items).reduce((a, c) => a.concat(c), [])],
                  includes: result.includes
                    ? {
                        Asset: [
                          ...result.includes.Asset,
                          ...response.map((item) => item.includes?.Asset ?? []).reduce((a, c) => a.concat(c), []),
                        ],
                        Entry: [
                          ...result.includes.Entry,
                          ...response.map((item) => item.includes?.Entry ?? []).reduce((a, c) => a.concat(c), []),
                        ],
                      }
                    : { Asset: [], Entry: [] },
                };
              })
            );
            /* eslint-enable @typescript-eslint/naming-convention */
          }

          return of(result);
        }),
        tap((result) => {
          observer.next(result);
          observer.complete();
        }),
        catchError((error) => {
          observer.error(error);
          observer.complete();

          return EMPTY;
        })
      )
      .subscribe();
  });
}
