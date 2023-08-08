import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Post } from '@angular-blog/posts/common';
import { PostCardComponent } from '@angular-blog/posts/ui/card';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';

@Component({
  selector: 'angular-blog-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, PostCardComponent, ColumnComponent, TabletDirective, WebDirective, RowComponent],
})
export class PostListComponent {
  @Input({ required: true }) posts!: Post[];
}
