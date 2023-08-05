import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { IconService } from '@angular-blog/core';
import { ContainerComponent } from '@angular-blog/ui/container';

import { appStore, playStore } from './footer.icons';

@Component({
  selector: 'angular-blog-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent, MatIconModule],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  constructor(private readonly iconService: IconService) {
    this.iconService.add('app_store', appStore);
    this.iconService.add('play_store', playStore);
  }
}
