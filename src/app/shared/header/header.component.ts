import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { SimpleChanges } from '@angular/core';
/**
 * The HeaderComponent is responsible for rendering the application's header section,
 * including the logo and the navigation bar (navbar).
 * It handles responsive behavior for mobile/desktop views and smooth scrolling to the home section.
 * Additionally, it manages a hover state for the logo and toggles the visibility of the navbar when needed.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  /**
   * Creates an instance of HeaderComponent and injects Angular Router.
   * @param router Angular Router used for navigating to the home section.
   */
  constructor(private router: Router) {}

  /**
   * Determines whether the logo is currently hovered (used for switching logo image).
   */
  isLogoHovered = false;

  /**
   * Reactive signal that controls whether the navbar should be rendered.
   */
  showNavbar = signal(true);

  /**
   * Internal state tracking the last known viewport size for comparison during change detection.
   */
  private previousMobileState = window.innerWidth <= 870;

  /**
   * Represents the currently active section of the app (e.g., 'home', 'about').
   */
  @Input() currentSection = 'home';

  /**
   * Flag indicating if the app is currently in mobile view.
   */
  @Input() isMobileView = false;

  /**
   * Flag indicating whether the mobile menu is currently open.
   */
  @Input() mobileMenuOpen = false;

  /**
   * EventEmitter triggered when the menu toggle button is clicked.
   */
  @Output() toggleMenu = new EventEmitter<void>();

  /**
   * ViewChild reference to the NavbarComponent instance (used for direct access if needed).
   */
  @ViewChild(NavbarComponent) navbarComp!: NavbarComponent;

  /**
   * Angular lifecycle hook that detects input changes.
   * If the `isMobileView` input has changed, it reloads the navbar to reflect the new state.
   * @param changes An object of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMobileView']) {
      const newVal = changes['isMobileView'].currentValue;
      if (newVal !== this.previousMobileState) {
        this.softReloadNavbar();
        this.previousMobileState = newVal;
      }
    }
  }

  /**
   * Forces a re-render of the navbar by briefly toggling `showNavbar` off and on.
   * This is useful for layout corrections when switching between mobile and desktop views.
   */
  private softReloadNavbar(): void {
    this.showNavbar.set(false);
    setTimeout(() => this.showNavbar.set(true), 0);
  }

  /**
   * Emits the `toggleMenu` event, typically triggered by the burger icon in mobile view.
   */
  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  /**
   * Handles touch interactions for navigating to the home section.
   * Prevents the default event behavior before delegating to `scrollToHome`.
   * @param event Touch event triggered by user interaction.
   */
  onTouchScrollToHome(event: TouchEvent): void {
    event.preventDefault();
    this.scrollToHome(event);
  }

  /**
   * Scrolls the page smoothly to the `#home` section.
   * Waits for the router to navigate (if not already on `/`) and then scrolls to the element.
   * @param event The event that triggered the scroll (MouseEvent or TouchEvent).
   */
  scrollToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('home');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }
}
