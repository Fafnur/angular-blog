import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { CategoriesComponent } from '@angular-blog/ui/categories';

@Component({
  selector: 'angular-blog-post-categories',
  templateUrl: './post-categories.component.html',
  styleUrls: ['./post-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, CategoriesComponent],
})
export class PostCategoriesComponent {}
