import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { LangSwitchComponent } from '../../../shared/components/lang-switch/lang-switch.component';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * Standalone component for the privacy policy (Datenschutzerklärung) page.
 *
 * This component provides:
 * - A detailed, translated privacy policy using `ngx-translate`
 * - A language switcher for real-time translation
 * - Keyboard accessibility (ESC key to return)
 * - Dynamic browser title for the page
 * - A "Back" icon to return to the contact section on the main page
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, TranslateModule, LangSwitchComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  /**
   * Initializes the component and sets the translated browser tab title.
   *
   * @param translate - Service for dynamic language switching
   * @param router - Router used to navigate back to contact section
   * @param title - Service to set the document/browser tab title
   */
  constructor(
    private translate: TranslateService,
    private router: Router,
    private title: Title
  ) {
    this.setTranslatedTitle();
  }

  /** Current language as a reactive signal ('de' | 'en') */
  language = signal<'de' | 'en'>('de');

  /** Icon path for the "Back" arrow */
  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';

  /**
   * Sets the translated browser title using the key `titles.privacy`.
   */
  setTranslatedTitle() {
    this.translate.get('titles.privacy').subscribe((translatedTitle: string) => {
      this.title.setTitle(translatedTitle);
    });
  }

  /**
   * Updates the current language and switches translation context.
   *
   * @param lang - Target language ('de' or 'en')
   */
  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang);
  }

  /**
   * Handles hover state for the "Back" arrow icon.
   *
   * @param hovered - Whether the user is hovering over the icon
   */
  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  /**
   * Navigates to the main page and scrolls smoothly to the contact section.
   *
   * @param event - Optional event to prevent default anchor behavior
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
   * Handles ESC key press to return to the contact section.
   *
   * @param event - Keyboard event for ESC key
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.scrollToContact();
  }
}
