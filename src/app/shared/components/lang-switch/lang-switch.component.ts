import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @component LangSwitchComponent
 *
 * A simple language toggle switch for 'de' and 'en' with animated visual feedback.
 * Uses ngx-translate to update the active language and emits language changes for external sync.
 *
 * @example
 * <app-lang-switch
 *   [currentLanguage]="language"
 *   (languageChanged)="setLanguage($event)"
 * />
 */
@Component({
  selector: 'app-lang-switch',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})

export class LangSwitchComponent {

  /**
   * Input to optionally set the current language (not strictly used in logic).
   * Kept for potential external binding.
   *
   * @default 'de'
   */
  @Input() currentLanguage: 'de' | 'en' = 'de';

  /**
   * Emits when the user changes the language.
   */
  @Output() languageChanged = new EventEmitter<'de' | 'en'>();

  constructor(private translate: TranslateService) { }

  /**
   * Determines if the current language is German.
   * Used to control button state and indicator movement.
   */
  isGerman(): boolean {
    return this.translate.currentLang === 'de';
  }

  /**
   * On init, reads stored language from localStorage (if available),
   * applies it to TranslateService and emits it for sync.
   */
  ngOnInit(): void {
    const savedLang = localStorage.getItem('language') as 'de' | 'en';
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.translate.use(savedLang);
      this.languageChanged.emit(savedLang);
    }
  }

  /**
   * Changes the language and stores it in localStorage.
   * Also updates ngx-translate and emits change for parent.
   *
   * @param lang - The language to switch to ('de' or 'en')
   */
  setLanguage(lang: 'de' | 'en'): void {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.languageChanged.emit(lang);
  }

}
