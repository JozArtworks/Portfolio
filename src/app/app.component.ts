import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { MobilePopoutComponent } from './shared/components/mobile-popout/mobile-popout.component';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';
import { signal } from '@angular/core';
import { SectionObserverService } from './../assets/services/section-observer.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, MobilePopoutComponent, ScrollPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private sectionObserver: SectionObserverService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);
  }

  handleMobileNavClick(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.toggleMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedOutsideMenu = !target.closest('app-mobile-popout') && !target.closest('.burger-menu');
    if (this.mobileMenuOpen && clickedOutsideMenu) {
      this.animationState = 'closing';
      setTimeout(() => {
        this.mobileMenuOpen = false;
        this.animationState = '';
      }, 100);
    }
  }

  isMobileView = true;
  mobileMenuOpen = false;
  animationState: 'open' | 'closing' | '' = '';

  translations = {
    de: {
      home: 'Home',
      about: 'Über mich',
      skills: 'Tools',
      projects: 'Projekte',
      feedbacks: 'Referenzen',
      contact: 'Kontakt'
    },
    en: {
      home: 'Home',
      about: 'About me',
      skills: 'Skills',
      projects: 'Projects',
      feedbacks: 'References',
      contact: 'Contact'
    }
  };

  language: 'de' | 'en' = 'de';

  setLanguage(lang: 'de' | 'en') {
    this.language = lang;
    this.translate.use(lang);
    this.cdr.detectChanges();
  }
  title = 'portfolio';

  currentRoute = '';
  currentSection = signal('home');

  onSectionChanged(sectionId: string) {
    this.currentSection.set(sectionId);
  }

  boundCheckViewport!: () => void;

  ngOnInit() {
    this.checkViewport();
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  ngAfterViewInit() {
    this.sectionObserver.observeSections(['home', 'about', 'skills', 'projects', 'feedbacks']);
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;

    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  getBackgroundClass() {
    if (this.currentRoute.includes('/legal/imprint') || this.currentRoute.includes('/legal/privacy-policy')) {
      return 'bg-imprint-policy';
    }
    if (this.currentRoute.includes('/about')) return 'bg-about';
    if (this.currentRoute.includes('/skills')) return 'bg-skills';
    if (this.currentRoute.includes('/projects')) return 'bg-projects';
    if (this.currentRoute.includes('/feedbacks')) return 'bg-feedbacks';
    if (this.currentRoute.includes('/contact')) return 'bg-contact';
    return 'bg-home';
  }

  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.animationState = 'closing';
      setTimeout(() => {
        this.mobileMenuOpen = false;
        this.animationState = '';
      }, 100);
    } else {
      this.mobileMenuOpen = true;
      this.animationState = 'open';
    }
  }

  shouldShowHeader(): boolean {
    return !['/legal/imprint', '/legal/privacy-policy'].includes(this.currentRoute);
  }

}
