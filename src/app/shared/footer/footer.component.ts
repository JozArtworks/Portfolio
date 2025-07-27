import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksImgComponent, RouterModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() scrolledAway = false;

  private boundCheckViewport!: () => void;
  private observer!: IntersectionObserver;

  showEmail = false;
  showCopyDialog = false;
  emailCopied = false;
  @ViewChild('footerElement') footerElementRef!: ElementRef;
  isVisible = false;

  @ViewChild('mailWrapper') mailWrapperRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const mailWrapperEl = this.mailWrapperRef?.nativeElement;
    const target = event.target as HTMLElement;
    const clickedMailIcon = target.closest('.tool-icon[data-icon="Mail"]');
    const clickedInsideWrapper = mailWrapperEl?.contains(target);
    if (!clickedInsideWrapper && !clickedMailIcon && this.showEmail) {
      this.showEmail = false;
    }
  }

  ngOnInit() {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
  }

  checkViewport() {
    const isMobile = window.innerWidth <= 870;
    if (!isMobile && this.showEmail) {
      this.showEmail = false;
    }
  }

  ngAfterViewInit() {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrolledAway'] && changes['scrolledAway'].currentValue === true) {
      this.showEmail = false;
      this.showCopyDialog = false;
    }
  }

  copyEmail() {
    const email = 'front-dev@jonathan-michutta.de';
    navigator.clipboard.writeText(email).then(() => {
      this.emailCopied = true;
      this.showEmail = false;
      this.showCopyDialog = true;
      setTimeout(() => {
        this.showCopyDialog = false;
        this.emailCopied = false;
      }, 1000);
    });
  }

  toggleEmail() {
    if (this.showCopyDialog) {
      return;
    }
    this.showEmail = !this.showEmail;
  }

}
