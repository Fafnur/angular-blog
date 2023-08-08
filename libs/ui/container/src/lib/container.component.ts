import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'angular-blog-container',
  template: '<ng-content></ng-content>',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContainerComponent {}
