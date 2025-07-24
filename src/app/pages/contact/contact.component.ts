import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionObserverService } from './../../../assets/services/section-observer.service';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, FormsModule, RouterModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', './contact-media.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {

  constructor(private translate: TranslateService, public sectionObserver: SectionObserverService) { }

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
  markTouched = false;
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
    return parts.length >= 2 && parts.every(part => part.length >= 3);
  }

  isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email.trim());
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
    this.nameValid = this.isValidName(this.formData.name);
    this.emailValid = this.isValidEmail(this.formData.email);
    this.messageValid = this.isValidMessage(this.formData.message);
    this.privacyValid = this.formData.privacyAccepted;
  }

  validateAndSubmit(): void {
    this.markTouched = true;
    this.onInputChange();
    if (!this.isFormValid) {
      return;
    }
    this.submitForm();
  }

  submitForm(): void {
    this.isSending = true;
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('email', this.formData.email);
    formData.append('message', this.formData.message);
    formData.append('honeypot', this.formData.honeypot);
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
    this.markTouched = false;
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
    if (!this.isMobileView) return this.translate.instant('contact.namePlaceholder');
    if (!this.nameValid && (this.markTouched || this.nameInput?.touched)) {
      return this.translate.instant('contact.nameError');
    }
    return this.translate.instant('contact.namePlaceholder');
  }

  get emailPlaceholder(): string {
    if (!this.isMobileView) return this.translate.instant('contact.emailPlaceholder');
    if (!this.emailValid && (this.markTouched || this.emailInput?.touched)) {
      return this.translate.instant('contact.emailError');
    }
    return this.translate.instant('contact.emailPlaceholder');
  }

  get messagePlaceholder(): string {
    if (!this.isMobileView) return this.translate.instant('contact.messagePlaceholder');
    if (!this.messageValid && (this.markTouched || this.messageInput?.touched)) {
      return this.translate.instant('contact.messageError');
    }
    return this.translate.instant('contact.messagePlaceholder');
  }

}
