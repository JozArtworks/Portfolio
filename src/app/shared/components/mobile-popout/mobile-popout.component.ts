import { Component, Input, Output, EventEmitter, HostListener, ViewChildren, ViewChild, ElementRef, QueryList } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * MobilePopoutComponent
 *
 * Displays an animated, accessible mobile navigation menu.
 * Includes section links, language switcher, and full keyboard navigation.
 * Focus is trapped within the menu and returns to the toggle button when closed.
 */
@Component({
  selector: 'app-mobile-popout',
  standalone: true,
  imports: [CommonModule, RouterModule, LangSwitchComponent, TranslateModule],
  templateUrl: './mobile-popout.component.html',
  styleUrl: './mobile-popout.component.scss',
})

export class MobilePopoutComponent {

  @Input() animationState: 'open' | 'closing' | '' = '';

  /** Controls the visibility of the mobile menu */
  @Input() mobileMenuOpen = false;

  /** Currently selected language ('de' or 'en') */
  @Input() language: 'de' | 'en' = 'de';

  /** ID of the currently active section (used to highlight the active nav link) */
  @Input() currentSection = '';

  /** Element to focus when the menu is closed (e.g. burger button) */
  @Input() focusTarget?: ElementRef<HTMLButtonElement>;

  /** Emits when the menu should be toggled (e.g. after closing or selecting a link) */
  @Output() toggleMenu = new EventEmitter<void>();

  /** Emits when the language is changed via the language switcher */
  @Output() setLanguage = new EventEmitter<'de' | 'en'>();

  /** Emits the path of the clicked nav item (optional) */
  @Output() navClicked = new EventEmitter<string>();

  /** Ref to the popout container for focus trapping */
  @ViewChild('popoutContainer') popoutContainerRef?: ElementRef<HTMLElement>;

  /** Refs to all anchor links within the menu */
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef<HTMLAnchorElement>>;

  /** Navigation items displayed inside the popout */
  navItems = [
    { path: 'home', key: 'nav.home' },
    { path: 'about', key: 'nav.about' },
    { path: 'skills', key: 'nav.skills' },
    { path: 'projects', key: 'nav.projects' },
    { path: 'feedbacks', key: 'nav.feedbacks' },
    { path: 'contact', key: 'nav.contact', isContact: true }
  ];

  /**
   * When the menu opens, focus the active or first link.
   */
  ngAfterViewInit() {
    if (this.mobileMenuOpen) {
      setTimeout(() => {
        const links = this.navLinks.toArray();
        const active = links.find(link => link.nativeElement.classList.contains('active'));
        (active ?? links[0])?.nativeElement.focus();
      }, 50);
    }
  }

  /**
   * When the menu is destroyed (closed), return focus to the original trigger (e.g. burger button).
   */
  ngOnDestroy() {
    this.focusTarget?.nativeElement.focus();
  }

  /**
   * Emits the selected language value.
   */
  changeLanguage(lang: 'de' | 'en') {
    this.setLanguage.emit(lang);
  }

  /**
   * Handles nav link clicks: scrolls to section and closes the menu.
   */
  onNavClick(path: string, event: MouseEvent) {
    event.preventDefault();
    const el = document.getElementById(path);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.toggleMenu.emit();
  }

  /**
   * Closes the menu when Escape is pressed.
   */
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.toggleMenu.emit();
  }

  /**
   * Global keyboard event handler for mobile popout navigation.
   *
   * - Traps focus inside the menu using Tab and Shift+Tab.
   * - Enables arrow key navigation (↑ / ↓) between nav links.
   * - Only active while the mobile menu is open.
   *
   * @param event - The KeyboardEvent fired by the document.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyNavigation(event: KeyboardEvent) {
    if (!this.mobileMenuOpen) return;
    if (event.key === 'Tab') {
      this.trapTabFocus(event);
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.navigateWithArrowKeys(event);
    }
  }

  /**
 * Ensures focus remains inside the mobile menu using Tab/Shift+Tab.
 *
 * - Wraps focus from last to first and vice versa.
 * - Prevents focus from leaving the dialog while open.
 *
 * @param event - The KeyboardEvent triggered by pressing Tab or Shift+Tab.
 */

  private trapTabFocus(event: KeyboardEvent) {
    const container = this.popoutContainerRef?.nativeElement;
    if (!container) return;
    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusable);
    if (list.length === 0) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
 * Enables vertical navigation between nav links using ↑ and ↓ keys.
 *
 * - Wraps from last to first and first to last.
 * - Moves focus to the next/previous link in the QueryList.
 *
 * @param event - The KeyboardEvent triggered by ArrowUp or ArrowDown.
 */
  private navigateWithArrowKeys(event: KeyboardEvent) {
    const links = this.navLinks.toArray();
    const index = links.findIndex(link => link.nativeElement === document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % links.length;
      links[nextIndex]?.nativeElement.focus();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + links.length) % links.length;
      links[prevIndex]?.nativeElement.focus();
    }
  }

}