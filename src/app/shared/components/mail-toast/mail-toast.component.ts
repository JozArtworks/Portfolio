import {
  Component,
  Input,
  inject,
  Signal,
  Output,
  EventEmitter,
  HostListener,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MailToastService } from '../../services/mail-toast.service';

@Component({
  selector: 'app-mail-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './mail-toast.component.html',
  styleUrls: ['./mail-toast.component.scss']
})
export class MailToastComponent {

  constructor() {
    effect(() => {
      const isCorrectContext = this.mailToastService.currentContext() === this.context;
      const shouldShow = this.showEmail() && isCorrectContext;

      if (shouldShow && !this.emailVisible) {
        this.emailVisible = true;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.shouldAnimateIn = true;
          });
        });
      }
      if (!shouldShow && this.emailVisible) {
        this.emailVisible = false;
        this.shouldAnimateIn = false;
      }
    });
  }

  emailVisible = false;
  shouldAnimateIn = false;

  private mailToastService = inject(MailToastService);

  @Input() showEmail!: Signal<boolean>;
  @Input() emailCopied!: Signal<boolean>;
  @Input() showCopyDialog!: Signal<boolean>;
  @Input() context: 'landing' | 'navbar' | 'footer' = 'landing';

  get animateClass(): string {
    return this.shouldAnimateIn ? 'animate-in' : '';
  }

  @Output() emailClosed = new EventEmitter<void>();
  @Output() emailCopiedSuccess = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.mail-wrapper');
    const clickedMailIcon = target.closest('.box-link, .box-link-nav-mobile');
    const clickedDialogCopy = target.closest('.dialog-copy');
    if (!clickedInside && !clickedMailIcon && !clickedDialogCopy && this.showEmail()) {
      this.closeEmail();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.showEmail()) {
      this.mailToastService.closeEmail();
    }
  }

  copyEmail(): void {
    const email = 'front-dev@jonathan-michutta.de';
    navigator.clipboard.writeText(email).then(() => {
      this.mailToastService.triggerCopySuccess();
      this.emailCopiedSuccess.emit();
    });
  }

  closeEmail(): void {
    this.mailToastService.closeEmail();
    this.emailClosed.emit();
  }
}
