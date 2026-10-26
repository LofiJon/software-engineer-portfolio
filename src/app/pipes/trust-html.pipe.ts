import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks static, developer-authored markup (e.g. inline SVG icons from i18n data) as trusted.
 * Angular's sanitizer strips <svg> from [innerHTML]; never use this with user input.
 */
@Pipe({
  name: 'trustHtml',
  standalone: true
})
export class TrustHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
