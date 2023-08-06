import 'hammerjs';

import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { appConfig } from './app.config';

const browserConfig: ApplicationConfig = {
  providers: [provideNoopAnimations()],
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
