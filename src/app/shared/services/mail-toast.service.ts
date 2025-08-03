import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

type ToastContext = 'landing' | 'navbar' | 'footer';

@Injectable({ providedIn: 'root' })
export class MailToastService {

  showEmail = signal(false);
  emailCopied = signal(false);
  showCopyDialog = signal(false);

  currentContext = signal<ToastContext>('landing');


  private isCopyBlocked = signal(false);

toggleEmail(context: ToastContext) {
  if (this.isCopyBlocked()) return;

  this.currentContext.set(context);
  this.showEmail.update(v => !v);
}


  triggerCopySuccess() {
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


  closeEmail() {
    this.showEmail.set(false);
  }
}
