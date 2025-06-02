import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {
  @Input() currentLanguage: 'de' | 'en' = 'de';
  @Output() languageChanged = new EventEmitter<'de' | 'en'>();

  isGerman(): boolean {
    return this.currentLanguage === 'de';
  }

  setLanguage(lang: 'de' | 'en') {
    this.languageChanged.emit(lang);
  }
}