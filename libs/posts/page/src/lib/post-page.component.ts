import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TitleComponent } from '@angular-blog/ui/title';

@Component({
  selector: 'angular-blog-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TitleComponent],
})
export class PostPageComponent {}
