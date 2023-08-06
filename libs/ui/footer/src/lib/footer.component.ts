import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '@angular-blog/ui/container';

import { CopyrightComponent } from './copyright/copyright.component';
import { MarketsComponent } from './markets/markets.component';

@Component({
  selector: 'angular-blog-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent, MarketsComponent, CopyrightComponent],
})
export class FooterComponent {}
