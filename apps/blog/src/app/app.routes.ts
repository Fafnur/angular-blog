import { Route } from '@angular/router';

import { FooterComponent } from '@angular-blog/ui/footer';
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
      {
        path: '',
        component: FooterComponent,
        outlet: 'footer',
      },
    ],
  },
];
