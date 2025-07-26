import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionObserverService } from './../../../assets/services/section-observer.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, FormsModule, RouterModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', './contact-media.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {

  constructor(private translate: TranslateService, public sectionObserver: SectionObserverService, private cd: ChangeDetectorRef) { }

  formData = {
    name: '',
    email: '',
    message: '',
    privacyAccepted: false,
    honeypot: ''
  };

  success = false;
  error = false;
  isSending = false;
  nameValid = false;
  emailValid = false;
  messageValid = false;
  privacyValid = false;
  privacyTouched = false;
  flyAnimation = false;
  isMobileView = false;
  resizeObserver: any;

  @ViewChild('form') formRef!: NgForm;
  @ViewChild('nameInput') nameInput!: NgModel;
  @ViewChild('emailInput') emailInput!: NgModel;
  @ViewChild('messageInput') messageInput!: NgModel;

  ngOnInit() {
    this.checkViewport();
    this.resizeObserver = () => this.checkViewport();
    window.addEventListener('resize', this.resizeObserver);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeObserver);
  }

  checkViewport(): void {
    this.isMobileView = window.innerWidth <= 870;
  }

  isValidName(name: string): boolean {
    const parts = name.trim().split(' ');
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  get currentSection() {
    return this.sectionObserver.currentSection();
  }

  isValidMessage(message: string): boolean {
    return message.trim().length >= 50;
  }

  get isFormValid(): boolean {
    return this.nameValid && this.emailValid && this.messageValid && this.privacyValid;
  }

  onInputChange(): void {
    const rawName = this.formData.name.trim();
    const parts = rawName.split(' ').filter(p => p.length >= 3);
    this.nameValid = this.isValidName(this.formData.name);
    this.emailValid = this.isValidEmail(this.formData.email);
    this.messageValid = this.isValidMessage(this.formData.message);
    this.privacyValid = this.formData.privacyAccepted;
  }

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

  private getFormData(): FormData {
    const fd = new FormData();
    fd.append('name', this.formData.name);
    fd.append('email', this.formData.email);
    fd.append('message', this.formData.message);
    fd.append('honeypot', this.formData.honeypot);
    return fd;
  }

  submitForm(): void {
    this.isSending = true;
    const formData = this.getFormData();
    fetch('/mail.php', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (res.ok) {
          this.success = true;
          this.error = false;
          this.flyAnimation = true;
          setTimeout(() => {
            this.flyAnimation = false;
            this.resetForm();
            setTimeout(() => {
              location.reload();
            }, 2000);
          }, 1000);
        } else {
          this.handleError();
        }
      })
      .catch(err => {
        this.handleError();
        console.error('Netzwerkfehler:', err);
      });
  }

  private resetForm(): void {
    this.isSending = false;
    this.formData = {
      name: '',
      email: '',
      message: '',
      privacyAccepted: false,
      honeypot: ''
    };
    this.nameValid = false;
    this.emailValid = false;
    this.messageValid = false;
    this.privacyValid = false;
    this.privacyTouched = false;
    this.formRef.resetForm();
    setTimeout(() => this.success = false, 4000);
  }

  private handleError(): void {
    this.isSending = false;
    this.error = true;
    this.success = false;
  }

  get namePlaceholder(): string {
    return this.translate.instant('contact.namePlaceholder');
  }

  get emailPlaceholder(): string {
    return this.translate.instant('contact.emailPlaceholder');
  }

  get messagePlaceholder(): string {
    return this.translate.instant('contact.messagePlaceholder');
  }

  onBlurDelayed() {
    setTimeout(() => {
      const inputEl = document.getElementById('nameInputId') as HTMLInputElement;
      if (inputEl) {
        this.formData.name = inputEl.value;
        this.onInputChange();
        this.cd.detectChanges();
      }
    }, 200);
  }

  onEmailBlurDelayed() {
    setTimeout(() => {
      const emailEl = document.getElementById('emailInputId') as HTMLInputElement;
      if (emailEl) {
        this.formData.email = emailEl.value;
        this.onInputChange();
        this.cd.detectChanges();
      }
    }, 200);
  }

  onMessageBlurDelayed() {
    setTimeout(() => {
      const msgEl = document.getElementById('messageInputId') as HTMLTextAreaElement;
      if (msgEl) {
        this.formData.message = msgEl.value;
        this.onInputChange();
        this.cd.detectChanges();
      }
    }, 200);
  }

  onPrivacyChange(): void {
    this.privacyTouched = true;
    this.onInputChange();
  }

}
