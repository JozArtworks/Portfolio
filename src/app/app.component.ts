import { Component, Input } from '@angular/core';
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
import { SectionObserverService } from './shared/services/section-observer.service';
import { ProjectDialogService } from './shared/services/project-dialog.service';
import { ProjectDialogComponent } from './pages/projects/dialog/project-dialog.component';
import { NgZone } from '@angular/core';
import { AppSettings } from './app.config';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, MobilePopoutComponent, ScrollPageComponent, ProjectDialogComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @Input() isAppReadyForTransition = false;

  title = 'portfolio';

  isAppLoaded = false;
  preloaderDone = false;
  showHeader = false;
  showReloadHint = false;

  exitPhase = false;

  isMobileView = true;
  orientationLocked = false;

  mobileMenuOpen = false;
  animationState: 'open' | 'closing' | '' = '';

  currentRoute = '';
  lastSection = '';

  isFading = false;
  didInitialFade = false;
  backgroundClassPrevious = '';
  backgroundClassCurrent = 'bg-home';

  private boundCheckViewport = () => { };

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public sectionObserver: SectionObserverService,
    public projectDialog: ProjectDialogService
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects;

      const mappedBackground = this.mapSectionToBg(this.currentRoute.replace('/', ''));

      if (mappedBackground !== this.backgroundClassCurrent) {
        this.setStaticBackground(mappedBackground);
      }
    });
  }

  setStaticBackground(newClass: string) {
    this.backgroundClassPrevious = this.backgroundClassCurrent;
    this.isFading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.backgroundClassCurrent = newClass;
      this.cdr.detectChanges();
    }, 100);

    setTimeout(() => {
      this.isFading = false;
      this.cdr.detectChanges();
    }, 600);
  }

  ngOnInit() {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
    this.checkOrientation();
    window.matchMedia('(orientation: landscape)').addEventListener('change', () => {
      this.checkOrientation();
    });
    setTimeout(() => {
      if (!this.isAppLoaded) {
        this.showReloadHint = true;
        this.cdr.detectChanges();
      }
    }, 3000);

    window.addEventListener('load', () => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.isAppLoaded = true;
              this.exitPhase = true;
              this.didInitialFade = true;
              this.cdr.detectChanges();
              setTimeout(() => this.preloaderDone = true, 800);
              setTimeout(() => {
                this.showHeader = true;
                this.cdr.detectChanges();
              }, 50);
            });
          }, AppSettings.loaderDelayMs);
        });
      });
    });
  }

  ngAfterViewInit() {
    this.sectionObserver.observeSections(['home', 'about', 'skills', 'projects', 'feedbacks', 'contact']);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  updateBackgroundOnSectionChange(sectionId: string) {
    const newClass = this.mapSectionToBg(sectionId);
    if (newClass !== this.backgroundClassCurrent) {
      this.backgroundClassPrevious = this.backgroundClassCurrent;
      this.isFading = true;
      setTimeout(() => {
        this.backgroundClassCurrent = newClass;
        this.cdr.detectChanges();
      }, 100);
      setTimeout(() => {
        this.isFading = false;
        this.cdr.detectChanges();
      }, 600);
    }
  }

  mapSectionToBg(section: string): string {
    switch (section) {
      case 'about': return 'bg-about';
      case 'skills': return 'bg-skills';
      case 'projects': return 'bg-projects';
      case 'feedbacks': return 'bg-feedbacks';
      case 'contact': return 'bg-contact';
      case 'imprint':
      case 'privacy-policy':
        return 'bg-imprint-policy';
      default: return 'bg-home';
    }
  }

  triggerFade() {
    this.isFading = true;
    setTimeout(() => this.isFading = false, 400);
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedOutsideMenu = !target.closest('app-mobile-popout') && !target.closest('.burger-menu');
    if (this.mobileMenuOpen && clickedOutsideMenu) {
      this.toggleMobileMenu();
    }
  }

  setLanguage(lang: 'de' | 'en') {
    this.translate.use(lang);
    this.cdr.detectChanges();
  }

  shouldScroll(): boolean {
    return this.currentRoute === '/';
  }

  shouldShowHeader(): boolean {
    return !['/imprint', '/privacy-policy'].includes(this.currentRoute);
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
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

  isOrientationLocked(): boolean {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    return isTouchDevice && isLandscape;
  }

  closeGlobalDialog() {
    this.projectDialog.close();
    document.body.style.overflow = 'auto';
  }

  openGlobalDialog() {
    this.projectDialog.open();
    document.body.style.overflow = 'hidden';
  }

  quantumPingVisible = false;

  toggleQuantumPing(): void {
    this.quantumPingVisible = !this.quantumPingVisible;
  }

  close(): void {
    this.quantumPingVisible = false;
  }


}
