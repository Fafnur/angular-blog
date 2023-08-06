import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ContainerComponent } from '@angular-blog/ui/container';

@Component({
  selector: 'angular-blog-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ContainerComponent],
})
export class BreadcrumbsComponent {
  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute.snapshot;

      while (route.firstChild) {
        route = route.firstChild;
      }

      this.update(route.data['breadcrumbs']);
    });
  }

  private update(data: any): void {}
}
