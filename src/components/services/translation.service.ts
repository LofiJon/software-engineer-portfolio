import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS, Lang, TranslationData } from '../../data/i18n.data';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Signal to hold the current language state
  private currentLangSignal = signal<Lang>('pt');

  // Computed signal that automatically updates when currentLangSignal changes
  // This exposes the full translation object for the active language
  public t = computed<TranslationData>(() => TRANSLATIONS[this.currentLangSignal()]);

  // Computed to check if current lang is EN (helper for UI toggles)
  public isEnglish = computed(() => this.currentLangSignal() === 'en');

  toggleLanguage() {
    this.currentLangSignal.update(lang => lang === 'pt' ? 'en' : 'pt');
  }

  setLanguage(lang: Lang) {
    this.currentLangSignal.set(lang);
  }

  getCurrentLang(): Lang {
    return this.currentLangSignal();
  }
}