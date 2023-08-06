import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ContainerComponent } from '@angular-blog/ui/container';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';
import { TitleComponent } from '@angular-blog/ui/title';

@Component({
  selector: 'angular-blog-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColumnComponent, MatIconModule, TabletDirective, WebDirective, TitleComponent],
})
export class PostPageComponent {}
