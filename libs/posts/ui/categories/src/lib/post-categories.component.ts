import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { categories } from './post.categories';

@Component({
  selector: 'angular-blog-post-categories',
  templateUrl: './post-categories.component.html',
  styleUrls: ['./post-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, NgForOf, MatCardModule],
})
export class PostCategoriesComponent {
  readonly categories = categories.slice(0, 10);
}
