import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'angular-blog-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TitleComponent {}
