import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(body: string | null | undefined): string {
    if (!body) {
      return '';
    }

    return this.sanitizer.sanitize(SecurityContext.NONE, this.sanitizer.bypassSecurityTrustHtml(body)) ?? '';
  }
}
