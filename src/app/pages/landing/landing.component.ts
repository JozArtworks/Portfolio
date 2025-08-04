import { Component, Input, HostListener, OnChanges, SimpleChanges, inject, computed } from '@angular/core';
import { LinksImgComponent } from "../../shared/components/links-img/links-img.component";
import { TranslateModule } from '@ngx-translate/core';
import { toolsIcons, ToolIcon } from '../../shared/data/tools-icons.data';
import { MailToastComponent } from '../../shared/components/mail-toast/mail-toast.component';
import { MailToastService } from '../../shared/services/mail-toast.service';

/**
 * LandingComponent
 *
 * This standalone Angular component represents the animated landing section of the portfolio.
 * It displays the user's name, subtitle, tool icons, and a link section with an email icon.
 * Additionally, it integrates with a centralized MailToastService to display a toast for
 * copying the email address, depending on the context (`landing`, `navbar`, or `footer`).
 *
 * Accessibility and responsiveness are considered: animations are triggered when the app is ready,
 * the email toast auto-hides on smaller viewports, and interaction is handled with keyboard & screen reader in mind.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LinksImgComponent, TranslateModule, MailToastComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnChanges {

  /**
   * Injected instance of MailToastService to control global email toast behavior.
   */
  public mailToastService = inject(MailToastService);

  /**
   * Internal flag to prevent immediate auto-closing when user clicks on the email icon.
   */
  private justToggledViaIcon = false;

  /**
   * Bound version of checkViewport for use in add/removeEventListener.
   */
  private boundCheckViewport = this.checkViewport.bind(this);

  /**
   * Fixed context identifier for this component (used for toast positioning & visibility logic).
   */
  context: 'landing' = 'landing';

  /**
   * Controls animation of tool icons and link box (after transition begins).
   */
  showBoxes = false;

  /**
   * Array of all available tool icons, imported from shared data.
   */
  toolsIcons: ToolIcon[] = toolsIcons;

  /**
   * Signal for whether the email toast is currently visible.
   */
  showEmail = this.mailToastService.showEmail;

  /**
   * Signal for whether the copy-success tooltip is visible.
   */
  emailCopied = this.mailToastService.emailCopied;

  /**
   * Signal for whether the copy-dialog (e.g. „Email copied!“) should be shown.
   */
  showCopyDialog = this.mailToastService.showCopyDialog;

  /**
   * Computed signal determining if the toast should be shown in this component's context.
   * Toast appears only if email/copy dialog is active and context === 'landing'.
   */
  showLandingToast = computed(() =>
    (this.mailToastService.showEmail() || this.mailToastService.showCopyDialog()) &&
    this.mailToastService.currentContext() === 'landing'
  );

  /**
   * Input controlling when animations (like fade-in) should start.
   */
  @Input() isAppReadyForTransition = false;

  /**
   * Input that determines if the landing section is scrolled out of view,
   * triggering animation and email toast dismissal.
   */
  @Input() scrolledAway = false;

  /**
   * Lifecycle hook: Called once after inputs are set.
   * Adds resize listener to handle responsive email toast behavior.
   */
  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  /**
   * Lifecycle hook: Called before component is destroyed.
   * Removes resize listener to avoid memory leaks.
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  /**
   * Lifecycle hook: Called when inputs change.
   * Starts animation if app is ready, and hides email toast if scrolled away.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isAppReadyForTransition']?.currentValue) {
      setTimeout(() => {
        this.showBoxes = true;
      }, 400);
    }
    if (changes['scrolledAway']?.currentValue === true) {
      this.onEmailClosed();
    }
  }

  /**
   * Closes the email toast automatically on mobile viewports (≤870px).
   */
  checkViewport() {
    const isMobile = window.innerWidth <= 870;
    if (isMobile && this.showEmail()) {
      this.onEmailClosed();
    }
  }

  /**
   * Toggles the email toast for this component.
   * Prevents immediate auto-close via `justToggledViaIcon`.
   */
  toggleEmail() {
    this.justToggledViaIcon = true;
    this.mailToastService.toggleEmail('landing');
  }

  /**
   * Called after user successfully copied the email address.
   * Triggers the success dialog inside the toast.
   */
  onEmailCopied() {
    this.mailToastService.triggerCopySuccess();
  }

  /**
   * Closes the email toast manually.
   */
  onEmailClosed() {
    this.mailToastService.closeEmail();
  }

  /**
   * Returns all tool icons except the third-to-last (typically a redundant one).
   * This is a layout-specific tweak.
   */
  get filteredToolsIcons(): ToolIcon[] {
    const tools = [...this.toolsIcons];
    tools.splice(-3, 1);
    return tools;
  }

  /**
   * Global document click handler.
   * Prevents email toast from being closed immediately after toggling it via icon.
   */
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (this.justToggledViaIcon) {
      this.justToggledViaIcon = false;
      return;
    }
    // Intentionally left blank for potential future toast-close logic.
  }
}