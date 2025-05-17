import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
@Pipe({
    name: 'safeUrl',
    standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
