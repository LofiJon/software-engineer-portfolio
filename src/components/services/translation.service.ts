import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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

  private document = inject(DOCUMENT);

  // Keep <html lang> in sync so screen readers use the right pronunciation
  private syncHtmlLang = effect(() => {
    this.document.documentElement.lang = this.isEnglish() ? 'en' : 'pt-BR';
  });

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