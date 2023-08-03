import { Route } from '@angular/router';

import { LayoutComponent } from '@angular-blog/ui/layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
  },
];
