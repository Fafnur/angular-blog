import { ChangeDetectionStrategy, Component } from '@angular/core';

import { categories } from './menu.categories';

@Component({
  selector: 'angular-blog-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class MenuComponent {
  readonly categories = categories;
}
