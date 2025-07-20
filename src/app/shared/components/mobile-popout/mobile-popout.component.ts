import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';

@Component({
  selector: 'app-mobile-popout',
  standalone: true,
  imports: [CommonModule, RouterModule, LangSwitchComponent],
  templateUrl: './mobile-popout.component.html',
  styleUrl: './mobile-popout.component.scss',
})
export class MobilePopoutComponent implements OnChanges {

  @Input() mobileMenuOpen = false;
  @Input() translate!: any;
  @Input() language: 'de' | 'en' = 'de';
  @Input() animationState: 'open' | 'closing' | '' = '';

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() setLanguage = new EventEmitter<'de' | 'en'>();
  @Output() navClicked = new EventEmitter<string>();

  onClick(section: string, event: Event) {
    event.preventDefault();
    this.navClicked.emit(section);
  }

  ngOnChanges() {
    if (!this.mobileMenuOpen) {
      this.animationState = 'closing';
      setTimeout(() => {
        this.animationState = 'open';
      }, 250);
    }
  }

  toggleMobileMenu() {
    this.toggleMenu.emit();
  }

  changeLanguage(lang: 'de' | 'en') {
    this.setLanguage.emit(lang);
  }
}
