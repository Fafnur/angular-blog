import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'angular-blog-row[no-gutter]',
  standalone: true,
})
export class NoGutterDirective {}
