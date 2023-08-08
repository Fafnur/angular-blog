import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { MetaService, MetricService } from '@angular-blog/core';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (metaService: MetaService, metricService: MetricService) => {
        return () => {
          metaService.init();
          metricService.init();
        };
      },
      multi: true,
      deps: [MetaService, MetricService],
    },
  ],
};
