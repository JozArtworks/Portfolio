import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnInit, OnDestroy, Input, Output, EventEmitter, computed, ViewChild } from '@angular/core';
import { inject, runInInjectionContext, EnvironmentInjector, signal, effect } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionObserverService } from '../services/section-observer.service';
import { MailToastService } from '../services/mail-toast.service';
import { MailToastComponent } from '../components/mail-toast/mail-toast.component';

/**
 * @component NavbarComponent
 *
 * The `NavbarComponent` provides a responsive, accessible navigation bar with animated indicator,
 * language switching, section observation, and context-aware email toast integration.
 *
 * It supports:
 * - Smooth scrolling and section tracking
 * - Language switching via ngx-translate
 * - Contextual email copying via a centralized MailToastService
 * - Mobile menu toggling and responsive behavior
 * - Active link highlighting and animated underline (indicator)
 *
 * This component uses Angular Signals, IntersectionObserver, and supports standalone setup.
 *
 * @example
 * ```html
 * <app-navbar
 *   [isMobileView]="isMobileView"
 *   [mobileMenuOpen]="mobileMenuOpen"
 *   [currentSection]="currentSection"
 *   (toggleMenu)="onToggleMenu()"
 * ></app-navbar>
 * ```
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent, LinksImgComponent, TranslateModule, MailToastComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * List of navigation items, including their path and translation key.
   * Used to render the nav links dynamically.
   */
  readonly navItems = [
    { path: 'home', key: 'nav.home' },
    { path: 'about', key: 'nav.about' },
    { path: 'skills', key: 'nav.skills' },
    { path: 'projects', key: 'nav.projects' },
    { path: 'feedbacks', key: 'nav.feedbacks' },
    { path: 'contact', key: 'nav.contact', isContact: true }
  ];

  /**
   * List of section IDs used for scroll tracking and IntersectionObserver.
   */
  readonly sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks', 'contact'];

  /** Reference to the centralized MailToastService for email dialog state. */
  mailToastService = inject(MailToastService);

  /** Current position of the active navigation indicator (underline). */
  activePos = signal({ left: 0, width: 0 });

  /** Currently selected UI language ('de' or 'en'). */
  language = signal<'de' | 'en'>('de');

  /** Name of the currently active interactive icon (e.g. GitHub). */
  activeIconName = '';

  /** Name of the icon currently being hovered. */
  hoveredIconName = '';

  /** Signal representing the currently active section (e.g. 'about', 'skills'). */
  currentUrl = this.sectionObserver.currentSection;

  /** Whether the current route is a scroll-based view (`/#section`) or not. */
  isScrollPage = signal(false);

  /** Injector used for reactive effects inside `runInInjectionContext`. */
  injector = inject(EnvironmentInjector);

  /**
   * Indicates whether the viewport is currently considered mobile (<= 870px).
   * This value is updated on window resize and used to toggle responsive UI behavior,
   * including conditional rendering of the mobile menu and email toast positioning.
   *
   * Accessible in the template to control layout logic via `@if (isMobileView)`.
   */
  public isMobileView = false;

  /**
   * Bound version of `checkViewport`, used as event listener callback.
   * Ensures correct `this` context when used with `addEventListener`.
   */
  private boundCheckViewport = this.checkViewport.bind(this);

  /**
   * Whether the animated nav indicator should be shown.
   * Only active on scrollable page sections.
   */
  showIndicator = computed(() => {
    const url = this.currentUrl();
    return ['home', 'about', 'skills', 'projects', 'feedbacks'].includes(url);
  });

  /**
   * Whether the navbar-specific email toast should be visible.
   * This depends on both the toast visibility and the current context.
   */
  showNavbarToast = computed(() =>
    (this.mailToastService.showEmail() || this.mailToastService.showCopyDialog()) &&
    this.mailToastService.currentContext() === 'navbar'
  );

  /** Whether the mobile menu is currently open. */
  @Input() mobileMenuOpen = false;

  /** The ID of the currently active section (used for highlighting nav links). */
  @Input() currentSection = '';

  /** Emits when the menu toggle button is clicked (used to open/close the mobile popout). */
  @Output() toggleMenu = new EventEmitter<void>();

  /** References to all navigation link elements (used for dynamic indicator positioning). */
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;

  /** Reference to the mobile toggle button (used for returning focus or styling). */
  @ViewChild('toggleBtn') toggleBtn?: ElementRef;

  /**
   * Injects core services for routing, translation, and section observation.
   *
   * @param router - Angular Router for navigation and event handling
   * @param translate - ngx-translate service for dynamic language switching
   * @param sectionObserver - Custom service for observing visible page sections
   */
  constructor(
    private router: Router,
    private translate: TranslateService,
    private sectionObserver: SectionObserverService
  ) { }

  /**
 * Initializes the component:
 * - Checks initial viewport size and updates state
 * - Adds resize event listener
 * - Sets initial section to 'home'
 * - Starts listening for route changes
 */
  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
    this.sectionObserver.setCurrentSection('home');
    this.observeRouteChanges();
  }

  /**
 * Called after the component’s view has been fully initialized.
 * - Starts observing section elements for active tracking
 * - Initializes the indicator animation effect
 */
  ngAfterViewInit() {
    setTimeout(() => {
      this.sectionObserver.observeSections(this.sectionIds);
    });
    setTimeout(() => this.setupIndicatorEffect());
  }

  /**
 * Cleans up event listeners when the component is destroyed.
 */
  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  /**
   * Initializes and wires reactive logic for updating the animated navbar indicator.
   *
   * This method sets up two core behaviors:
   * 1. **ViewChildren readiness**: Subscribes to `navLinks.changes` to ensure the
   *    indicator updates when the list of navigation links changes (e.g., after language switch).
   * 2. **Reactive signal tracking**: Uses Angular's `effect()` to re-run the indicator update
   *    whenever the current URL signal (`currentUrl`) changes due to scrolling or navigation.
   *
   * Wrapped inside `runInInjectionContext` to ensure Signals work correctly within the component's
   * dependency injection environment.
   *
   * This ensures the indicator position is always in sync with the currently active section.
   */
  private setupIndicatorEffect() {
    runInInjectionContext(this.injector, () => {
      this.navLinks.changes.subscribe(() => {
        this.updateIndicator();
      });
      this.updateIndicator();
      effect(() => {
        this.currentUrl();
        this.updateIndicator();
      }, { allowSignalWrites: true });
    });
  }

  /**
 * Subscribes to Angular router events to detect navigation changes
 * and updates section tracking accordingly.
 */
  private observeRouteChanges(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleNavigation(event);
      }
    });
  }

  /**
 * Handles a router NavigationEnd event:
 * - Determines if the current view is a scrollable section page
 * - Either starts observing sections or sets the current route manually
 *
 * @param event - The NavigationEnd router event
 */
  private handleNavigation(event: NavigationEnd): void {
    const url = event.urlAfterRedirects || event.url;
    const isScroll = url === '/' || url.startsWith('/#');
    this.isScrollPage.set(isScroll);
    if (isScroll) {
      setTimeout(() => this.sectionObserver.observeSections(this.sectionIds), 0);
    } else {
      const cleanPath = url.split('/')[1];
      this.sectionObserver.setCurrentSection(cleanPath);
    }
  }

  /**
 * Handles click on a navigation link. Scrolls smoothly to the target section
 * and closes the mobile menu if active.
 *
 * @param path - ID of the section to scroll to
 * @param event - The MouseEvent triggered by the click
 */
  onNavClick(path: string, event: MouseEvent) {
    event.preventDefault();
    const el = document.getElementById(path);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.ifMobileOpenToggle();
  }

  /**
 * Returns whether the given path matches the currently active section.
 *
 * @param path - The section ID to compare
 * @returns True if the section is currently active
 */
  isLinkActive(path: string): boolean {
    const current = this.sectionObserver.currentSection();
    return current === path;
  }

  /**
 * Changes the current language via ngx-translate and updates the indicator position.
 *
 * @param lang - Language code ('de' or 'en')
 */
  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang).subscribe(() => {
      setTimeout(() => {
        this.updateIndicator();
      }, 100);
    });
  }

  /**
 * Emits toggleMenu and closes any open email toast in navbar context.
 */
  emitToggleMenu() {
    if (this.mailToastService.showEmail()) {
      this.mailToastService.closeEmail();
    }
    this.toggleMenu.emit();
  }

  /**
 * Toggles the mobile menu open/closed.
 */
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
 * Closes the mobile menu.
 */
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  /**
 * Closes the mobile menu if currently open and in mobile view.
 */
  ifMobileOpenToggle() {
    if (this.isMobileView && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Updates the `isMobileView` flag based on the current window width (<= 870px).
   * Also closes the email toast if the viewport switches to desktop view
   * and a toast is currently open in the navbar context.
   *
   * This method is called:
   * - on `ngOnInit()` to initialize the state
   * - on window resize via `addEventListener`
   */
  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
    if (!this.isMobileView && this.mailToastService.showEmail()) {
      this.mailToastService.closeEmail();
    }
  }

  /**
 * Updates the animated indicator to align with the currently active navigation link.
 */
  updateIndicator() {
    if (!this.navLinks || this.navLinks.length === 0) return;
    const activeLink = this.navLinks.find(link => {
      const sectionId = link.nativeElement.getAttribute('data-section-id');
      return sectionId === this.currentUrl();
    });
    this.navLinks.forEach(link => {
      const sectionId = link.nativeElement.getAttribute('data-section-id');
      const isActive = sectionId === this.currentUrl();
      link.nativeElement.classList.toggle('active', isActive);
    });
    if (activeLink) {
      const el = activeLink.nativeElement;
      this.activePos.set({ left: el.offsetLeft, width: el.offsetWidth });
    } else {
      this.activePos.set({ left: 0, width: 0 });
    }
  }

  /**
 * Toggles the active state for an interactive icon (e.g. click-based highlight).
 *
 * @param name - The icon name to activate/deactivate
 */
  setActiveIcon(name: string) {
    this.activeIconName = this.activeIconName === name ? '' : name;
  }

  /**
 * Sets the hovered icon name to change its appearance on hover.
 *
 * @param name - The icon name currently hovered
 */
  setHoveredIcon(name: string) {
    this.hoveredIconName = name;
  }

  /**
 * Clears the currently hovered icon state.
 */
  clearHoveredIcon() {
    this.hoveredIconName = '';
  }

  /**
 * Returns the correct icon path for a given icon object based on hover/active state.
 *
 * @param icon - Icon descriptor object with name and optional interactivity
 * @returns The path to the corresponding icon image
 */
  getIconSrc(icon: { name: string; interactive?: boolean }) {
    const base = icon.name.toLowerCase();
    const isHovered = this.hoveredIconName === icon.name;
    const isActive = icon.interactive && this.activeIconName === icon.name;
    const colorFolder = isHovered || isActive ? 'green' : 'white';
    return `assets/icons/${colorFolder}/${base}_${colorFolder}.png`;
  }

  /**
   * Triggers the visual feedback (copy success) when the email address
   * has been successfully copied to the clipboard.
   */
  onEmailCopied() {
    this.mailToastService.triggerCopySuccess();
  }

  /**
   * Closes the currently visible email toast (copy dialog) for the navbar context.
   */
  onEmailClosed() {
    this.mailToastService.closeEmail();
  }

  /**
   * Toggles the visibility of the email toast (copy dialog) for the navbar context.
   * If the mobile menu is open, it will be closed before showing the toast.
   */
  toggleEmail() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
    this.mailToastService.toggleEmail('navbar');
  }

}