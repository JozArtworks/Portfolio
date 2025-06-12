import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class MobilePopoutComponent {

  @Input() mobileMenuOpen = false;
  @Input() translate!: any;
  @Input() language: 'de' | 'en' = 'de';
  @Input() animationState: 'open' | 'closing' | '' = '';



  @Output() toggleMenu = new EventEmitter<void>();
  @Output() setLanguage = new EventEmitter<'de' | 'en'>();


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
