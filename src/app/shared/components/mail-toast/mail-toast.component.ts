import { Component, Input, Output, EventEmitter, HostListener, inject, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MailToastService } from '../../services/mail-toast.service';

/**
 * @component MailToastComponent
 *
 * Displays a context-sensitive mail toast with copy-to-clipboard functionality,
 * dynamic signal-based visibility, accessibility support, and animated entry behavior.
 *
 * This component is fully standalone and works with a reactive MailToastService
 * to centrally manage state like email visibility, copy dialog, and animation logic.
 *
 * @example
 * <app-mail-toast
 *   [showEmail]="mailService.showEmail"
 *   [emailCopied]="mailService.emailCopied"
 *   [showCopyDialog]="mailService.showCopyDialog"
 *   [context]="'footer'"
 *   (emailClosed)="onEmailClosed()"
 *   (emailCopiedSuccess)="onEmailCopied()"
 * />
 *
 * @see MailToastService
 * @see emailCopied, showEmail, showCopyDialog (Signals)
 */
@Component({
  selector: 'app-mail-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './mail-toast.component.html',
  styleUrls: ['./mail-toast.component.scss'],
})

export class MailToastComponent {

  private mailToastService = inject(MailToastService);

  /**
   * Tracks whether the toast is currently rendered in the DOM.
   * Used for `@if` rendering in the template.
   */
  emailVisible = false;

  /**
   * Determines if the toast should have the animated entry class.
   * Applied via ngClass for opening transition.
   */
  shouldAnimateIn = false;

  /**
   * Reactive signal that determines if the mail toast should be shown.
   * Usually controlled centrally by MailToastService.
   *
   * @required
   */
  @Input({ required: true }) showEmail!: Signal<boolean>;

  /**
   * Reactive signal that indicates if the email address was copied.
   * Used to visually mark the copy button and trigger closing logic.
   *
   * @required
   */
  @Input({ required: true }) emailCopied!: Signal<boolean>;

  /**
   * Reactive signal that controls whether the "copied" feedback dialog should be shown.
   *
   * @required
   */
  @Input({ required: true }) showCopyDialog!: Signal<boolean>;

  /**
   * Context of the toast. Used to position and style the toast differently
   * in different layout sections.
   *
   * @default 'landing'
   */
  @Input() context: 'landing' | 'navbar' | 'footer' = 'landing';

  /**
   * Emits when the user closes the email toast (via click-outside, ESC, or copy success).
   */
  @Output() emailClosed = new EventEmitter<void>();

  /**
   * Emits after the email was successfully copied to the clipboard.
   */
  @Output() emailCopiedSuccess = new EventEmitter<void>();

  /**
   * Initializes an effect that watches `showEmail` and `context`,
   * and shows or hides the toast accordingly.
   * Uses double requestAnimationFrame to trigger CSS animation properly.
   */
  constructor() {
    effect(() => {
      const isCorrectContext = this.mailToastService.currentContext() === this.context;
      const shouldShow = this.showEmail() && isCorrectContext;
      if (shouldShow && !this.emailVisible) {
        this.showToast();
      }
      if (!shouldShow && this.emailVisible) {
        this.hideToast();
      }
    });
  }

  /**
   * Shows the toast and triggers entry animation on the next rendering cycle.
   */
  private showToast(): void {
    this.emailVisible = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.shouldAnimateIn = true;
      });
    });
  }

  /**
   * Immediately hides the toast and removes animation state.
   */
  private hideToast(): void {
    this.emailVisible = false;
    this.shouldAnimateIn = false;
  }

  /**
   * Copies the email address to clipboard and triggers
   * the success flow via MailToastService.
   */
  copyEmail(): void {
    const email = 'front-dev@jonathan-michutta.de';
    navigator.clipboard.writeText(email).then(() => {
      this.mailToastService.triggerCopySuccess();
      this.emailCopiedSuccess.emit();
    });
  }

  /**
   * Closes the toast and emits a close event.
   */
  closeEmail(): void {
    this.mailToastService.closeEmail();
    this.emailClosed.emit();
  }

  /**
   * Returns the class for animation when toast is shown.
   * Used in combination with context class via ngClass.
   */
  get animateClass(): string {
    return this.shouldAnimateIn ? 'animate-in' : '';
  }

  /**
   * Closes the toast when clicking outside of defined toast or trigger elements.
   */
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const safeSelectors = ['.mail-wrapper', '.box-link', '.box-link-nav-mobile', '.dialog-copy'];
    const clickedInside = safeSelectors.some(sel => target.closest(sel));
    if (!clickedInside && this.showEmail()) {
      this.closeEmail();
    }
  }

  /**
   * Closes the toast when ESC key is pressed.
   */
  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.showEmail()) {
      this.closeEmail();
    }
  }

}
