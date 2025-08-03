import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, Output, EventEmitter, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MailToastComponent } from '../../shared/components/mail-toast/mail-toast.component';
import { MailToastService } from '../../shared/services/mail-toast.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksImgComponent, RouterModule, TranslateModule, MailToastComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * FooterComponent – Responsible for rendering the application footer.
 *
 * Features:
 * - Visibility-based entrance animation via IntersectionObserver
 * - Email toast interaction handled by MailToastService
 * - Scroll-to-top navigation with smooth animation
 * - Language-aware content and accessibility support
 * - Optional visual interaction trigger (e.g., symbolic click event)
 */
export class FooterComponent implements AfterViewInit, OnDestroy {

  /**
   * Defines the context in which the footer is rendered.
   * Used to control context-specific behavior (e.g., toast positioning).
   */
  @Input() context: 'landing' | 'footer' | 'navbar' = 'landing';

  /**
   * Emits an event when the logo is clicked.
   * Can be used to trigger visual interactions or symbolic UI responses.
   */
  @Output() quantumPingTriggered = new EventEmitter<void>();

  /**
   * Element reference to the footer container for visibility tracking.
   */
  @ViewChild('footerElement') footerElementRef!: ElementRef;

  /**
   * Injected service managing visibility and state of the email toast.
   */
  public mailToastService = inject(MailToastService);

  private justToggledViaIcon = false;
  private boundCheckViewport!: () => void;
  private observer!: IntersectionObserver;

  /** Tracks visibility state for footer entrance animation */
  isVisible = false;

  /** Hover state for the logo icon */
  isHovered = false;

  /** Signal getters from MailToastService */
  showEmail = this.mailToastService.showEmail;
  emailCopied = this.mailToastService.emailCopied;
  showCopyDialog = this.mailToastService.showCopyDialog;

  constructor(private router: Router) { }

  /**
   * Registers viewport resize listener and performs initial layout check.
   */
  ngOnInit() {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
  }

  /**
   * Initializes both the contact section observer and footer visibility observer.
   */
  ngAfterViewInit() {
    this.initContactObserver();
    this.initFooterObserver();
  }

  /**
   * Cleans up event listeners and observers.
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Sets up an IntersectionObserver for the contact section.
   * Automatically closes the mail toast when the section is out of view.
   */
  private initContactObserver(): void {
    const contactEl = document.getElementById('contact');
    if (!contactEl) return;
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && this.showEmail()) {
          this.mailToastService.closeEmail();
        }
      },
      { threshold: 0.4 }
    );
    contactObserver.observe(contactEl);
  }

  /**
   * Sets up an IntersectionObserver to track the visibility of the footer itself.
   * Used to trigger animations or visual transitions.
   */
  private initFooterObserver(): void {
    if (!this.footerElementRef) return;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );
    this.observer.observe(this.footerElementRef.nativeElement);
  }

  /**
   * Closes the email toast automatically if in mobile view.
   */
  checkViewport() {
    const isMobile = window.innerWidth <= 870;
    if (isMobile && this.showEmail()) {
      this.onEmailClosed();
    }
  }

  /**
   * Toggles the visibility of the email toast in the current context.
   */
  toggleEmail() {
    this.justToggledViaIcon = true;
    this.mailToastService.toggleEmail('footer');
  }

  /**
   * Emits a signal that the email was successfully copied.
   */
  onEmailCopied() {
    this.mailToastService.triggerCopySuccess();
  }

  /**
   * Closes the email toast.
   */
  onEmailClosed() {
    this.mailToastService.closeEmail();
  }

  /**
   * Handles touch-based scroll interactions to navigate back to the top section.
   */
  onTouchScrollToHome(event: TouchEvent) {
    event.preventDefault();
    this.scrollToHome(event);
  }

  /**
   * Navigates to the homepage and scrolls smoothly to the `#home` anchor.
   */
  scrollToHome(event: Event) {
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

  /**
   * Computed signal that determines whether the MailToast should be rendered in the footer context.
   */
  showFooterToast = computed(() =>
    (this.mailToastService.showEmail() || this.mailToastService.showCopyDialog()) &&
    this.mailToastService.currentContext() === 'footer'
  );

  /**
   * Prevents accidental closure of the toast when it was just toggled via icon click.
   */
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (this.justToggledViaIcon) {
      this.justToggledViaIcon = false;
      return;
    }
  }

  /**
   * Emits an external event triggered by user interaction with the logo.
   * Can be used to activate symbolic or decorative visual effects.
   */
  toggleQuantumPingExtern(): void {
    this.quantumPingTriggered.emit();
  }

}
