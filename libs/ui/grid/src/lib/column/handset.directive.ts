import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'angular-blog-column[handset],angular-blog-column[handset-offset]',
  standalone: true,
})
export class HandsetDirective {
  @Input() handset?: string | number;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('handset-offset') handsetOffset?: string | number;
  @Input() fafnHandsetOffset?: string | number;
}
