import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'angular-blog-column[tablet],angular-blog-column[tablet-offset]',
  standalone: true,
})
export class TabletDirective {
  @Input() tablet?: string | number;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('tablet-offset') tabletOffset?: string | number;
}
