import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { Post } from '@angular-blog/posts/common';
import { ColumnComponent, RowComponent, TabletDirective } from '@angular-blog/ui/grid';

import { BackgroundImagePipe } from './background-image.pipe';

@Component({
  selector: 'angular-blog-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, RouterLink, MatButtonModule, ColumnComponent, TabletDirective, RowComponent, NgStyle, BackgroundImagePipe],
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
}
