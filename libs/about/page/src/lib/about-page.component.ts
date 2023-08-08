import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '@angular-blog/ui/container';

@Component({
  selector: 'angular-blog-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent],
})
export class AboutPageComponent {}
