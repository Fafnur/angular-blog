import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

import { PostCategoriesComponent } from '@angular-blog/posts/ui/categories';
import { ContainerComponent } from '@angular-blog/ui/container';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';
import { TitleComponent } from '@angular-blog/ui/title';

@Component({
  selector: 'angular-blog-post-layout',
  templateUrl: './post-layout.component.html',
  styleUrls: ['./post-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    MatIconModule,
    TabletDirective,
    WebDirective,
    TitleComponent,
    PostCategoriesComponent,
    RouterOutlet,
  ],
})
export class PostLayoutComponent {}
