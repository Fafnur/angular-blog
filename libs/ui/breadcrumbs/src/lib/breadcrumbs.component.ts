import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

import { NavigationLink } from '@angular-blog/core';

@Component({
  selector: 'angular-blog-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: NavigationLink[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => this.update()),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.update();
  }

  private update(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['breadcrumbs']) {
      this.breadcrumbs = route.data['breadcrumbs'];
      this.changeDetectorRef.markForCheck();
    }
  }
}
