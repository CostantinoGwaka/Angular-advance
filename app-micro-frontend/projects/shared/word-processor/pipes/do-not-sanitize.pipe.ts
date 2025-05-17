import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLCleanerUtility } from '../../utils/html.cleaner.utils';

@Pipe({
    name: 'doNotSanitize',
    standalone: true,
})
export class DoNotSanitizePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }

  transform(html: string): SafeHtml {
    // Remove dangerous tags
    const sanitizedHtml = HTMLCleanerUtility.removeDangerousTags(html);

    // Remove unwanted classes
    const cleanedHtml = HTMLCleanerUtility.removeUnwantedClasses(sanitizedHtml);

    // Sanitize and return the safe HTML
    return this.domSanitizer.bypassSecurityTrustHtml(cleanedHtml);
  }
}
