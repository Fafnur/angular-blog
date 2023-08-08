import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '@angular-blog/ui/container';

@Component({
  selector: 'angular-blog-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContainerComponent, MatButtonModule, RouterLink],
})
export class NotFoundPageComponent {}
