import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '@angular-blog/posts/common';

@Component({
  selector: 'angular-blog-post-view-page',
  templateUrl: './post-view-page.component.html',
  styleUrls: ['./post-view-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, DatePipe],
})
export class PostViewPageComponent implements OnInit {
  post!: Post;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['post']) {
      this.post = route.data['post'];
    }
  }
}
