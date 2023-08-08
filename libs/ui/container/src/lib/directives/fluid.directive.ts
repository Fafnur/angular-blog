import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'angular-blog-container[fluid]',
  standalone: true,
})
export class FluidDirective {}
