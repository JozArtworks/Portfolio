import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MailToastComponent } from '../../shared/components/mail-toast/mail-toast.component';
import { inject, HostListener, computed } from '@angular/core';
import { MailToastService } from '../../shared/services/mail-toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksImgComponent, RouterModule, TranslateModule, MailToastComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit, OnDestroy {

  @Input() context: 'landing' | 'footer' | 'navbar' = 'landing';
  @Output() quantumPingTriggered = new EventEmitter<void>();

  toggleQuantumPingExtern(): void {
    this.quantumPingTriggered.emit();
  }


  public mailToastService = inject(MailToastService);

  showEmail = this.mailToastService.showEmail;
  emailCopied = this.mailToastService.emailCopied;
  showCopyDialog = this.mailToastService.showCopyDialog;




  constructor(private router: Router) { }

  private boundCheckViewport!: () => void;
  private observer!: IntersectionObserver;



  isHovered = false;


  @ViewChild('footerElement') footerElementRef!: ElementRef;
  isVisible = false;



  ngOnInit() {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
  }

  checkViewport() {
    const isMobile = window.innerWidth <= 870;
    if (isMobile && this.showEmail()) {
      this.onEmailClosed();
    }
  }

  ngAfterViewInit() {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
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
    if (!this.footerElementRef) return;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );
    this.observer.observe(this.footerElementRef.nativeElement);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
    if (this.observer) {
      this.observer.disconnect();
    }
  }


  toggleEmail() {
    this.justToggledViaIcon = true;
    this.mailToastService.toggleEmail('footer');
  }

  onEmailCopied() {
    this.mailToastService.triggerCopySuccess();
  }

  onEmailClosed() {
    this.mailToastService.closeEmail();
  }



  onTouchScrollToHome(event: TouchEvent) {
    event.preventDefault();
    this.scrollToHome(event);
  }

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

  private justToggledViaIcon = false;

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (this.justToggledViaIcon) {
      this.justToggledViaIcon = false;
      return;
    }
  }

  showFooterToast = computed(() =>
    (this.mailToastService.showEmail() || this.mailToastService.showCopyDialog()) &&
    this.mailToastService.currentContext() === 'footer'
  );



}
