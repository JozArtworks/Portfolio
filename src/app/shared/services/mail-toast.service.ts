import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

type ToastContext = 'landing' | 'navbar' | 'footer';

/**
 * @service MailToastService
 *
 * Centralized reactive service that manages the visibility and behavior
 * of a context-sensitive email toast component.
 *
 * This service uses Angular Signals to control UI state such as:
 * - Whether the mail toast is visible (`showEmail`)
 * - Whether the email has been copied (`emailCopied`)
 * - Whether the copy feedback dialog is shown (`showCopyDialog`)
 * - The current layout context (`currentContext`)
 *
 * It also handles cooldown logic to prevent rapid toggling during animations.
 *
 * @example
 * // Injected in a component
 * const mailToastService = inject(MailToastService);
 * mailToastService.toggleEmail('footer');
 *
 * @see MailToastComponent
 */
@Injectable({ providedIn: 'root' })

export class MailToastService {

  /**
   * Signal indicating whether the mail toast should be visible.
   * Controlled by toggle and close logic.
   */
  showEmail = signal(false);

  /**
   * Signal that becomes true when the email has been successfully copied.
   * Used for styling or visual feedback on the copy button.
   */
  emailCopied = signal(false);

  /**
   * Signal that controls the visibility of the "copied" confirmation dialog.
   * Appears briefly after a successful copy action.
   */
  showCopyDialog = signal(false);

  /**
   * Signal that tracks which context (landing, navbar, footer) is currently active.
   * Used by the toast component to determine whether it should render itself.
   */
  currentContext = signal<ToastContext>('landing');

  /**
   * Private internal signal used to prevent toggling while feedback is active.
   */
  private isCopyBlocked = signal(false);

  /**
   * Toggles the visibility of the mail toast for a given context.
   * If a copy action is currently blocking toggles, this call is ignored.
   *
   * @param context - The toast location context (e.g., 'footer', 'navbar', 'landing').
   */
  toggleEmail(context: ToastContext): void {
    if (this.isCopyBlocked()) return;

    this.currentContext.set(context);
    this.showEmail.update(v => !v);
  }

  /**
   * Triggers the flow that handles a successful copy action:
   * - Marks `emailCopied` as true for styling
   * - Closes the mail toast
   * - Opens the "copied" feedback dialog
   * - Blocks toggling for 2 seconds
   */
  triggerCopySuccess(): void {
    this.emailCopied.set(true);
    this.showEmail.set(false);
    this.showCopyDialog.set(true);
    this.isCopyBlocked.set(true);

    setTimeout(() => {
      this.emailCopied.set(false);
      this.showCopyDialog.set(false);
      this.isCopyBlocked.set(false);
    }, 2000);
  }

  /**
   * Immediately closes the mail toast by setting `showEmail` to false.
   * Used in click-outside logic or ESC key handling.
   */
  closeEmail(): void {
    this.showEmail.set(false);
  }

}
