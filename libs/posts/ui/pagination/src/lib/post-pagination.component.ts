import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterLink, MatButtonModule],
})
export class PostPaginationComponent implements OnInit {
  links!: NavigationLink[];

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['pagination']) {
      const pagination: {
        readonly page: number;
        readonly total: number;
        readonly route: string;
      } = route.data['pagination'];

      this.links = Array.from({ length: pagination.total }, (v: unknown, k: number) => {
        return {
          label: `${k + 1}`,
          route: pagination.route === '/feed' && k === 0 ? '/' : `${pagination.route}/${k + 1}`,
        };
      });
    }
  }
}
