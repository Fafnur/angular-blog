import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '@angular-blog/ui/container';

@Component({
  selector: 'angular-blog-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
