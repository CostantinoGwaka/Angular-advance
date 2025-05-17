import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoadingCoverService } from './loading-cover.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: any = {};
  private defaultLanguage = 'en';
  TRANSLATIONS_LOADING_ACTION_ID = 'translations';

  constructor(
    private storageService: StorageService,
    private loadingCoverService: LoadingCoverService
  ) {
    // Load translations for default language
    this.loadTranslations(this.defaultLanguage);
  }

  setDefaultLanguage(language: string): void {
    if (this.defaultLanguage != language) {
      this.defaultLanguage = language;
      this.loadTranslations(this.defaultLanguage);
    }
  }

  getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  loadTranslations(language: string): void {
    // Load translations for the given language from your API endpoint
    // this.loadingCoverService.setItemBeingLoaded({
    //   id: 'translations-local',
    // });
    // const localTranslations = localStorage.getItem(`LANGUAGE_${language}`);
    // if (localTranslations) {
    //   this.translations[language] = JSON.parse(localTranslations);
    //   this.loadingCoverService.setItemFinishedLoading('translations-local');
    //   return;
    // } else {
    //   this.loadingCoverService.setItemFinishedLoading('translations-local');
    // }
    this.loadTranslationsFromServer(language);
  }

  async loadTranslationsFromServer(language: string): Promise<void> {
    this.loadingCoverService.setItemBeingLoaded({
      id: this.TRANSLATIONS_LOADING_ACTION_ID,
    });
    await fetch(


      // `${environment.AUTH_URL}/nest-uaa/languages/translations/${language}`
      `${environment.AUTH_URL}/nest-cache/languages/by/code/${language}`
    )
      .then((response) => response.json())
      .then((translations) => {
        if (translations?.hasOwnProperty('error')) {
          this.loadingCoverService.setError(
            this.TRANSLATIONS_LOADING_ACTION_ID,
            () => {
              this.loadTranslationsFromServer(this.defaultLanguage);
            }
          );
        } else {
          this.translations[language] = translations;
        }
      })
      .catch((error) => {
        this.loadingCoverService.setError(
          this.TRANSLATIONS_LOADING_ACTION_ID,
          () => {
            this.loadTranslationsFromServer(this.defaultLanguage);
          }
        );
      });
    this.loadingCoverService.setItemFinishedLoading(
      this.TRANSLATIONS_LOADING_ACTION_ID
    );
  }

  getCachedTranslation(key: string): string {
    if (this.translations.hasOwnProperty(this.defaultLanguage)) {
      const languageTranslations = this.translations[this.defaultLanguage];
      if (languageTranslations.hasOwnProperty(key)) {
        return languageTranslations[key];
      }
    }
    return key; // return the key if translation not found
  }

  translate(key: string, language?: string): string {
    // Get the translation for the given key and language
    language = language || this.defaultLanguage;
    const translation = Object.keys(this.translations).includes(language)
      ? this.translations[language][key]
      : null;
    // Return the translation if found, or the key itself if not found
    return translation ? translation : key;
  }
}
