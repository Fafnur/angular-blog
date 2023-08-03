import { Route } from '@angular/router';

import { HeaderComponent } from '@angular-blog/ui/header';
import { LayoutComponent } from '@angular-blog/ui/layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HeaderComponent,
        outlet: 'header',
      },
    ],
  },
];
