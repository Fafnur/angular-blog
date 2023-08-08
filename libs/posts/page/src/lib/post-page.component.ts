import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '@angular-blog/posts/common';
import { PostListComponent } from '@angular-blog/posts/ui/list';
import { PostPaginationComponent } from '@angular-blog/posts/ui/pagination';
import { TitleComponent } from '@angular-blog/ui/title';

@Component({
  selector: 'angular-blog-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TitleComponent, PostListComponent, PostPaginationComponent],
})
export class PostPageComponent implements OnInit {
  posts!: Post[];

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['posts']) {
      this.posts = route.data['posts'];
    }
  }
}
