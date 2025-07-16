import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-lang-switch',
  standalone: true,
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {

  constructor(private translate: TranslateService) { }


  @Input() currentLanguage: 'de' | 'en' = 'de';
  @Output() languageChanged = new EventEmitter<'de' | 'en'>();

  isGerman(): boolean {
    return this.translate.currentLang === 'de';
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('language') as 'de' | 'en';
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.languageChanged.emit(savedLang);
    }
  }

  setLanguage(lang: 'de' | 'en') {
    localStorage.setItem('language', lang);
    this.languageChanged.emit(lang);
  }
}