import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslationService } from '../../services/translation.service';

@Pipe({
    name: 'translate',
    pure: false // Set pure to false to listen to changes in the language
    ,
    standalone: true
})
export class TranslatePipe implements PipeTransform {
  lastLanguage: string;

  constructor(private translationService: TranslationService) {
    this.lastLanguage = translationService.getDefaultLanguage();
  }

  transform(key: string, args?: string): string {
    // Get the current language from the translation service
    const currentLanguage = args || this.translationService.getDefaultLanguage();
    if (currentLanguage !== this.lastLanguage) {
      this.lastLanguage = currentLanguage;
      // language has changed, trigger the transform method
      return this.translationService.translate(key, currentLanguage);
    }

    // language has not changed, return the cached result
    return this.translationService.getCachedTranslation(key);

  }
}
