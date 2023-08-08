import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'angular-blog-column[web],angular-blog-column[web-offset]',
  standalone: true,
})
export class WebDirective {
  @Input() web?: string | number;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('web-offset') webOffset?: string | number;
}
