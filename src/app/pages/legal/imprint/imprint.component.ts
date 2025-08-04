import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LangSwitchComponent } from '../../../shared/components/lang-switch/lang-switch.component';
import { Title } from '@angular/platform-browser';

/**
 * Standalone component for the legal notice (Impressum) page.
 *
 * This component provides:
 * - Static legal contact information and responsibilities
 * - Multilingual support via `ngx-translate`
 * - A dynamic document title using `TitleService`
 * - A language switcher component
 * - A "back to contact" button and keyboard accessibility (ESC key)
 */
@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule, TranslateModule, LangSwitchComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  /**
   * Initializes the component and sets the translated document title.
   *
   * @param translate - Translation service for dynamic language switching
   * @param router - Angular router for navigation back to contact section
   * @param title - Angular service to set the browser tab title
   */
  constructor(
    private translate: TranslateService,
    private router: Router,
    private title: Title
  ) {
    this.setTranslatedTitle();
  }

  /** Current language as a signal ('de' or 'en') used by the language switcher */
  language = signal<'de' | 'en'>('de');

  /** Path to the left-arrow icon, changes on hover */
  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';

  /**
   * Sets the translated browser tab title based on the current language.
   */
  setTranslatedTitle() {
    this.translate.get('titles.imprint').subscribe((translatedTitle: string) => {
      this.title.setTitle(translatedTitle);
    });
  }

  /**
   * Updates the current language signal and triggers ngx-translate.
   *
   * @param lang - The selected language ('de' or 'en')
   */
  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang);
  }

  /**
   * Updates the icon based on hover state.
   *
   * @param hovered - Whether the icon is being hovered
   */
  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  /**
   * Navigates to the main page and scrolls smoothly to the contact section.
   *
   * @param event - Optional click or keyboard event to prevent default behavior
   */
  scrollToContact(event?: Event) {
    event?.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  /**
   * Handles ESC key press to navigate back to the contact section.
   *
   * @param event - Keyboard event triggered by ESC
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.scrollToContact();
  }
}
