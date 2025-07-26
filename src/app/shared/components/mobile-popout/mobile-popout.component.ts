import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-mobile-popout',
  standalone: true,
  imports: [CommonModule, RouterModule, LangSwitchComponent, TranslateModule],
  templateUrl: './mobile-popout.component.html',
  styleUrl: './mobile-popout.component.scss',
})
export class MobilePopoutComponent implements OnChanges {

  @Input() mobileMenuOpen = false;
  @Input() language: 'de' | 'en' = 'de';
  @Input() animationState: 'open' | 'closing' | '' = '';
  @Input() currentSection = '';


  @Output() toggleMenu = new EventEmitter<void>();
  @Output() setLanguage = new EventEmitter<'de' | 'en'>();
  @Output() navClicked = new EventEmitter<string>();

  navItems = [
    { path: 'home', key: 'nav.home' },
    { path: 'about', key: 'nav.about' },
    { path: 'skills', key: 'nav.skills' },
    { path: 'projects', key: 'nav.projects' },
    { path: 'feedbacks', key: 'nav.feedbacks' },
    { path: 'contact', key: 'nav.contact', isContact: true }
  ];

  onNavClick(path: string, event: MouseEvent) {
    event.preventDefault();
    const el = document.getElementById(path);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.toggleMenu.emit();
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
