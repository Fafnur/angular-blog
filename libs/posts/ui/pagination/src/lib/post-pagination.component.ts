import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NavigationLink } from '@angular-blog/core';

@Component({
  selector: 'angular-blog-post-pagination',
  templateUrl: './post-pagination.component.html',
  styleUrls: ['./post-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgForOf, RouterLink, MatButtonModule],
})
export class PostPaginationComponent implements OnInit {
  links!: NavigationLink[];

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }
    const pagination:
      | {
          readonly page: number;
          readonly total: number;
          readonly route: string;
        }
      | undefined = route.data['pagination'];

    if (pagination && pagination.total !== 1) {
      this.links = Array.from({ length: pagination.total }, (v: unknown, k: number) => {
        return {
          label: `${k + 1}`,
          route: pagination.route === '/feed' && k === 0 ? '/' : k === 0 ? pagination.route : `${pagination.route}/${k + 1}`,
        };
      });
    }
  }
}
