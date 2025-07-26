import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { MobilePopoutComponent } from './shared/components/mobile-popout/mobile-popout.component';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';
import { SectionObserverService } from './../assets/services/section-observer.service';
import { ProjectDialogService } from './../assets/services/project-dialog.service';
import { ProjectDialogComponent } from './pages/projects/dialog/project-dialog.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, MobilePopoutComponent, ScrollPageComponent, ProjectDialogComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  orientationLocked = false;
  isMobileView = true;
  mobileMenuOpen = false;
  animationState: 'open' | 'closing' | '' = '';
  currentRoute = '';
  lastSection = '';
  isFading = false;
  title = 'portfolio';

  private boundCheckViewport: () => void = () => { };

  constructor(
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public sectionObserver: SectionObserverService,
    public projectDialog: ProjectDialogService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  ngOnInit() {
    this.checkViewport();
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkOrientation();
    window.matchMedia('(orientation: landscape)').addEventListener('change', () => {
      this.checkOrientation();
    });
  }

  checkOrientation() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const newLockState = isTouchDevice && isLandscape;
    if (newLockState !== this.orientationLocked) {
      this.orientationLocked = newLockState;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  ngAfterViewInit() {
    this.sectionObserver.observeSections(['home', 'about', 'skills', 'projects', 'feedbacks', 'contact']);
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

  handleMobileNavClick(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.toggleMobileMenu();
  }

  setLanguage(lang: 'de' | 'en') {
    this.translate.use(lang);
    this.cdr.detectChanges();
  }

  shouldScroll(): boolean {
    return this.currentRoute === '/';
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;

    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  getBackgroundClass() {
    if (this.currentRoute === '/imprint' || this.currentRoute === '/privacy-policy') {
      return 'bg-imprint-policy';
    }
    if (this.currentRoute === '/') {
      const section = this.sectionObserver.currentSection();
      if (section !== this.lastSection) {
        this.triggerFade();
        this.lastSection = section;
      }
      switch (section) {
        case 'about': return 'bg-about';
        case 'skills': return 'bg-skills';
        case 'projects': return 'bg-projects';
        case 'feedbacks': return 'bg-feedbacks';
        case 'contact': return 'bg-contact';
        default: return 'bg-home';
      }
    }
    return 'bg-home';
  }

  triggerFade() {
    this.isFading = true;
    setTimeout(() => {
      this.isFading = false;
    }, 400);
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
    return !['/imprint', '/privacy-policy'].includes(this.currentRoute);
  }

  closeGlobalDialog() {
    this.projectDialog.close();
    document.body.style.overflow = 'auto';
  }

  openGlobalDialog() {
    this.projectDialog.open();
    document.body.style.overflow = 'hidden';
  }

  isOrientationLocked(): boolean {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    return isTouchDevice && isLandscape;
  }

}