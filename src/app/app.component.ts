import { Component, Input, signal, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { MobilePopoutComponent } from './shared/components/mobile-popout/mobile-popout.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';
import { SectionObserverService } from './shared/services/section-observer.service';
import { ProjectDialogService } from './shared/services/project-dialog.service';
import { ProjectDialogComponent } from './pages/projects/dialog/project-dialog.component';
import { AppSettings } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, MobilePopoutComponent, ScrollPageComponent, ProjectDialogComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

/**
 * Root component of the portfolio application.
 * Manages global app behavior including background transitions, mobile menu,
 * viewport/orientation handling, language switching, and modal dialogs.
 */
export class AppComponent {

  /**
   * Stores the bound resize listener for later removal.
   */
  private boundCheckViewport = () => { };

  /**
   * Reactive signal to determine whether orientation lock should be shown.
   */
  readonly orientationIsLocked = signal(false);

  /** Current animation state of the mobile menu. */
  animationState: 'open' | 'closing' | '' = '';

  /** Previous background class for crossfading. */
  backgroundClassPrevious = '';

  /** Current route as URL path. */
  currentRoute = '';

  /** Previously viewed section (used for tracking). */
  lastSection = '';

  /** Current background class for the view. */
  backgroundClassCurrent = 'bg-home';

  /** Indicates if the application has finished loading. */
  isAppLoaded = false;

  /** Indicates if the preloader has completed its transition. */
  preloaderDone = false;

  /** Controls the visibility of the main header. */
  showHeader = false;

  /** Shows reload fallback hint if app load fails. */
  showReloadHint = false;

  /** Used during the exit phase of the preloader. */
  exitPhase = false;

  /** Tracks whether the current viewport is considered mobile. */
  isMobileView = true;

  /** Whether the mobile menu is currently open. */
  mobileMenuOpen = false;

  /** Visibility flag for the quantum ping easter egg. */
  quantumPingVisible = false;

  /** Controls fading animation between backgrounds. */
  isFading = false;

  /** Used to indicate whether the initial fade-in completed. */
  didInitialFade = false;

  /**
   * External signal to trigger transition animations.
   */
  @Input() isAppReadyForTransition = false;

  /**
   * Creates the AppComponent and sets up route background logic.
   */
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

  /**
   * Initializes app-wide listeners and preloader logic.
   */
  ngOnInit() {
    this.initViewportListeners();
    this.initPreloaderSequence();
    this.setupReloadHintFallback();
  }

  /**
   * Starts section observer for scroll tracking after view init.
   */
  ngAfterViewInit() {
    this.sectionObserver.observeSections(['home', 'about', 'skills', 'projects', 'feedbacks', 'contact']);
  }

  /**
   * Cleans up global event listeners on destroy.
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  /**
   * Adds listeners for viewport resize and orientation changes.
   */
  private initViewportListeners(): void {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
    this.checkOrientation();
    window.matchMedia('(orientation: landscape)').addEventListener('change', () => {
      this.checkOrientation();
    });
  }

  /**
   * Handles the preloader and startup transition sequence.
   */
  private initPreloaderSequence(): void {
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

  /**
   * Triggers a fallback hint if the app doesn't load within 3s.
   */
  private setupReloadHintFallback(): void {
    setTimeout(() => {
      if (!this.isAppLoaded) {
        this.showReloadHint = true;
        this.cdr.detectChanges();
      }
    }, 3000);
  }

  /**
   * Smoothly transitions the app background class with a fade.
   * @param newClass The new background class name.
   */
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

  /**
   * Called when a scroll-based section change occurs.
   * @param sectionId The new section ID to update the background for.
   */
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

  /**
   * Maps a route section to a background class.
   * @param section The section name or route segment.
   * @returns The corresponding background class string.
   */
  mapSectionToBg(section: string): string {
    switch (section) {
      case 'about': return 'bg-about';
      case 'skills': return 'bg-skills';
      case 'projects': return 'bg-projects';
      case 'feedbacks': return 'bg-feedbacks';
      case 'contact': return 'bg-contact';
      case 'imprint':
      case 'privacy-policy': return 'bg-imprint-policy';
      default: return 'bg-home';
    }
  }

  /**
   * Triggers a short fade animation manually.
   */
  triggerFade() {
    this.isFading = true;
    setTimeout(() => this.isFading = false, 400);
  }

  /**
   * Toggles the state of the mobile navigation menu.
   */
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

  /**
   * Sets the active language for translations.
   * @param lang The language code ('de' or 'en').
   */
  setLanguage(lang: 'de' | 'en') {
    this.translate.use(lang);
    this.cdr.detectChanges();
  }

  /**
   * Whether scrolling is allowed based on current route.
   */
  shouldScroll(): boolean {
    return this.currentRoute === '/';
  }

  /**
   * Whether the header should be shown (based on route).
   */
  shouldShowHeader(): boolean {
    return !['/imprint', '/privacy-policy'].includes(this.currentRoute);
  }

  /**
   * Updates the mobile view flag based on window width.
   */
  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Checks whether orientation lock should be activated.
   */
  checkOrientation() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const newLockState = isTouchDevice && isLandscape;
    this.orientationIsLocked.set(newLockState);
    this.cdr.detectChanges();
  }

  /**
   * Determines whether the mobile menu popout should be shown.
   */
  shouldShowMobilePopout(): boolean {
    return this.isMobileView && (this.mobileMenuOpen || this.animationState === 'closing') && this.shouldShowHeader();
  }

  /**
   * Closes the global project dialog and re-enables body scroll.
   */
  closeGlobalDialog() {
    this.projectDialog.close();
    document.body.style.overflow = 'auto';
  }

  /**
   * Opens the global project dialog and disables body scroll.
   */
  openGlobalDialog() {
    this.projectDialog.open();
    document.body.style.overflow = 'hidden';
  }

  /**
   * Toggles the visibility of the quantum easter egg.
   */
  toggleQuantumPing(): void {
    this.quantumPingVisible = !this.quantumPingVisible;
  }

  /**
   * Closes the quantum dialog manually.
   */
  close(): void {
    this.quantumPingVisible = false;
  }

  /**
   * Handles clicks outside the mobile menu to close it.
   * @param event Mouse event from the document.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedOutsideMenu = !target.closest('app-mobile-popout') && !target.closest('.burger-menu');
    if (this.mobileMenuOpen && clickedOutsideMenu) {
      this.toggleMobileMenu();
    }
  }

}
