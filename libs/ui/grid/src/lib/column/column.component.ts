import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'angular-blog-column',
  template: '<ng-content></ng-content>',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ColumnComponent {}
