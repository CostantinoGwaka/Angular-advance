import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLCleanerUtility } from '../utils/html.cleaner.utils';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }

  transform(html: string): SafeHtml {
    const sanitizedHtml = HTMLCleanerUtility.removeDangerousTags(html);
    const cleanedHtml = HTMLCleanerUtility.removeUnwantedClasses(sanitizedHtml);
    return this.domSanitizer.bypassSecurityTrustHtml(cleanedHtml);
  }
}
