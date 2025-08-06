import { Component, OnInit, OnDestroy, ElementRef, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionObserverService } from '../../shared/services/section-observer.service';

/**
 * @component ContactComponent
 *
 * A standalone Angular component that renders a multilingual contact form with validation,
 * responsive behavior, accessibility enhancements, and success/failure animations.
 *
 * Handles form submission via a honeypot-protected POST request, manages input validation
 * manually, and emits an optional `quantumPingTriggered` event for Easter Egg interaction.
 *
 * ### Main Features:
 * - Name, email, message and privacy checkbox validation
 * - Honeypot anti-spam protection
 * - Custom animations on successful send
 * - Responsive viewport detection (`isMobileView`)
 * - Integration with ngx-translate for i18n placeholders
 * - Emits a quantum event trigger for secret interactions
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, FormsModule, RouterModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', './contact-media.component.scss'],
})

export class ContactComponent implements OnInit, OnDestroy {

  /** Holds the current form input values including name, email, message, privacy acceptance, and honeypot. */
  formData = {
    name: '',
    email: '',
    message: '',
    privacyAccepted: false,
    honeypot: ''
  };

  /**
 * Enables soft-reset rendering after a successful transmission sequence.
 */
  formVisible = true;

  /** Controls the visibility of the success dialog */
  showSuccessDialog = false;

  /** Indicates if the form submission was successful. */
  success = false;

  /** Indicates if an error occurred during submission. */
  error = false;

  /** Indicates if the form is currently being submitted. */
  isSending = false;

  /** Validation flag for name field. */
  nameValid = false;

  /** Validation flag for email field. */
  emailValid = false;

  /** Validation flag for message field. */
  messageValid = false;

  /** Validation flag for privacy checkbox. */
  privacyValid = false;

  /** Tracks if privacy checkbox was interacted with (for error styling). */
  privacyTouched = false;

  /** Controls the animation for a successful form submission. */
  flyAnimation = false;

  /** True if the current viewport is mobile-sized (≤ 870px). */
  isMobileView = false;

  /** Stores the resize event handler for cleanup. */
  resizeObserver: any;

  /** Template reference to the NgForm. */
  @ViewChild('form') formRef!: NgForm;

  /** Template reference to name, email & message field model. */
  @ViewChild('nameInput') nameInput!: NgModel;
  @ViewChild('emailInput') emailInput!: NgModel;
  @ViewChild('messageInput') messageInput!: NgModel;

  /** Raw ElementRef of the name, email & message input (for blur sync). */
  @ViewChild('nameInputEl') nameInputRef!: ElementRef;
  @ViewChild('emailInputEl') emailInputRef!: ElementRef;
  @ViewChild('messageInputEl') messageInputRef!: ElementRef;

  /** Emits when the quantum ping is triggered from the contact page. */
  @Output() quantumPingTriggered = new EventEmitter<void>();

  /**
 * Initializes the ContactComponent with translation support,
 * section observation, and change detection.
 *
 * @param translate - Service for retrieving translations via `ngx-translate`.
 * @param sectionObserver - Tracks the current visible page section for UI updates.
 * @param cd - ChangeDetectorRef used for manually triggering change detection.
 */
  constructor(private translate: TranslateService, public sectionObserver: SectionObserverService, private cd: ChangeDetectorRef) { }

  /**
 * Initializes mobile viewport detection and adds resize event listener.
 */
  ngOnInit() {
    this.checkViewport();
    this.resizeObserver = () => this.checkViewport();
    window.addEventListener('resize', this.resizeObserver);
  }

  /**
 * Cleans up the resize event listener on destroy.
 */
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeObserver);
  }

  /**
 * Updates `isMobileView` based on the current window width.
 */
  checkViewport(): void {
    this.isMobileView = window.innerWidth <= 870;
  }

  /**
 * Validates full name input: expects at least two parts with min 2 characters each.
 * @param name - The raw name input string
 * @returns Whether the name is considered valid
 */
  isValidName(name: string): boolean {
    if (!name) return false;
    const parts = name.trim().split(' ');
    return parts.length >= 2 && parts.filter(p => p.trim().length >= 2).length >= 2;
  }

  /**
 * Validates the email address format.
 * @param email - The raw email string
 * @returns Whether the email is valid
 */
  isValidEmail(email: string): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /**
 * Validates the message content (minimum 10 characters).
 * @param message - The raw message string
 * @returns Whether the message is valid
 */
  isValidMessage(message: string | null | undefined): boolean {
    return !!message && message.trim().length >= 10;
  }

  /**
 * Updates all field validation flags based on the current formData.
 */
  onInputChange(): void {
    this.nameValid = this.isValidName(this.formData.name);
    this.emailValid = this.isValidEmail(this.formData.email);
    this.messageValid = this.isValidMessage(this.formData.message);
    this.privacyValid = this.formData.privacyAccepted;
  }

  /**
 * Validates the form and either submits it or highlights invalid fields.
 */
  validateAndSubmit(): void {
    this.onInputChange();
    if (!this.isFormValid) {
      this.privacyTouched = true;
      this.nameInput.control.markAsTouched();
      this.emailInput.control.markAsTouched();
      this.messageInput.control.markAsTouched();
      this.cd.detectChanges();
      const firstInvalid = document.querySelector('.form-field.invalid') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }
    this.submitForm();
  }

  /**
   * Emits the `quantumPingTriggered` output event. Used for interactions.
   */
  triggerQuantumPingFromContact(): void {
    this.quantumPingTriggered.emit();
    console.clear();
    console.log('%c☲ QX-492 // INITIERE PROTOKOLL …', 'color:#00ffe1; font-weight:bold;');
    setTimeout(() => {
      console.log('%cLade Erinnerungskern… █▒▒▒▒▒▒▒▒▒ 10%', 'color:#8afff1');
    }, 600);
    setTimeout(() => {
      console.log('%cLade Erinnerungskern… ██████▒▒▒▒ 65%', 'color:#8afff1');
    }, 1200);
    setTimeout(() => {
      console.log('%cLade Erinnerungskern… ██████████ 100%', 'color:#8afff1');
    }, 1800);
    setTimeout(() => {
      console.log('%cVerbindung zu Äther-Kanal #7.42 aufgebaut.', 'color:#fbbf24');
    }, 2400);
    setTimeout(() => {
      console.log('%cSynchronisation abgeschlossen.', 'color:#34d399');
    }, 3000);
    this.selfDestroy();
  }

  /**
 * Destroy the log in the dev-tool.
 */
  selfDestroy() {
    setTimeout(() => {
      let countdown = 10;
      const interval = setInterval(() => {
        if (countdown > 0) {
          console.log(`%c╳ Rückzug in ${countdown}…`, 'color:#7dd3fc');
          countdown--;
        } else {
          console.log('%c╳ QX-492 verschwindet im Äther…', 'color:#a78bfa');
          clearInterval(interval);
          setTimeout(() => {
            console.clear();
          }, 1000);
        }
      }, 600);
    }, 5800);
  }

  /**
 * Handles form submission logic and initiates success or error feedback.
 */
  submitForm(): void {
    this.isSending = true;
    const formData = this.getFormData();
    this.sendFormData(formData)
      .then((success) => {
        if (success) {
          this.handleSuccess();
        } else {
          this.handleError();
        }
      })
      .catch(() => {
        this.handleError();
      });
  }

  /**
 * Sends form data to `mail.php` via a POST request.
 * @param formData - The FormData object containing name, email, message, and honeypot
 * @returns A promise resolving to `true` if successful, otherwise `false`
 */
  private async sendFormData(formData: FormData): Promise<boolean> {
    try {
      const res = await fetch('/mail.php', {
        method: 'POST',
        body: formData
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Handles a successful form submission:
   * - Ends the sending state
   * - Triggers fly-out animation for the send button
   * - After animation, displays the success dialog
   */
  private handleSuccess(): void {
    this.isSending = false;
    this.success = true;
    this.flyAnimation = true;
    setTimeout(() => {
      this.flyAnimation = false;
      this.showSuccessDialog = true;
    }, 1000);
  }

  /**
   * Resets the form after closing the success dialog:
   * - Hides the form to allow a visual reset
   * - Clears success state
   * - Re-displays the form and resets input fields
   */
  onStartNewMessage(): void {
    this.showSuccessDialog = false;
    this.success = false;
    this.formVisible = false;
    setTimeout(() => {
      this.formVisible = true;
      setTimeout(() => {
        if (this.formRef) {
          this.resetForm();
        }
      }, 500);
    });
  }

  /**
* Handles failed submission attempts.
*/
  private handleError(): void {
    this.isSending = false;
    this.error = true;
    this.success = false;
  }

  /**
 * Updates name model value from native element after blur delay.
 */
  onBlurDelayed() {
    setTimeout(() => {
      this.formData.name = this.nameInputRef.nativeElement.value;
      this.onInputChange();
      this.cd.detectChanges();
    }, 200);
  }

  /**
 * Updates email model value from native element after blur delay.
 */
  onEmailBlurDelayed() {
    setTimeout(() => {
      this.formData.email = this.emailInputRef.nativeElement.value;
      this.onInputChange();
      this.cd.detectChanges();
    }, 200);
  }

  /**
 * Updates message model value from native element after blur delay.
 */
  onMessageBlurDelayed() {
    setTimeout(() => {
      this.formData.message = this.messageInputRef.nativeElement.value;
      this.onInputChange();
      this.cd.detectChanges();
    }, 200);
  }

  /**
 * Updates privacy validation state after checkbox interaction.
 */
  onPrivacyChange(): void {
    this.privacyTouched = true;
    this.onInputChange();
  }

  /**
 * Resets the entire form state and clears all validation and animations.
 */
  private resetForm(): void {
    this.isSending = false;
    this.formData = {
      name: '',
      email: '',
      message: '',
      privacyAccepted: false,
      honeypot: ''
    };
    this.resetProcess();
    this.cd.detectChanges();
    setTimeout(() => {
      this.nameInputRef.nativeElement.focus();
    });
    setTimeout(() => this.success = false, 4000);
  }

  /**
 * Resets the entire form state and clears all validation and animations part 2.
 */
  resetProcess() {
    this.nameValid = false;
    this.emailValid = false;
    this.messageValid = false;
    this.privacyValid = false;
    this.privacyTouched = false;
    this.formRef.resetForm();
    this.nameInput.control.markAsPristine();
    this.nameInput.control.markAsUntouched();
    this.emailInput.control.markAsPristine();
    this.emailInput.control.markAsUntouched();
    this.messageInput.control.markAsPristine();
    this.messageInput.control.markAsUntouched();
  }

  /**
 * Constructs a FormData object for the current form fields.
 * @returns A FormData instance with name, email, message, honeypot
 */
  private getFormData(): FormData {
    const fd = new FormData();
    fd.append('name', this.formData.name);
    fd.append('email', this.formData.email);
    fd.append('message', this.formData.message);
    fd.append('honeypot', this.formData.honeypot ?? '');
    return fd;
  }

  /** Translated placeholder for name, email & message input. */
  get namePlaceholder(): string {
    return this.translate.instant('contact.namePlaceholder');
  }

  /** */
  get emailPlaceholder(): string {
    return this.translate.instant('contact.emailPlaceholder');
  }

  /** */
  get messagePlaceholder(): string {
    return this.translate.instant('contact.messagePlaceholder');
  }

  /** Computed form validity based on all validation flags. */
  get isFormValid(): boolean {
    return this.nameValid && this.emailValid && this.messageValid && this.privacyValid;
  }

  /** Gets the current section from the SectionObserverService (used for styling or logic). */
  get currentSection() {
    return this.sectionObserver.currentSection();
  }

}