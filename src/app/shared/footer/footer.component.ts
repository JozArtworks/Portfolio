import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,

} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksImgComponent, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {


  @ViewChild('mailWrapper') mailWrapperRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const mailWrapperEl = this.mailWrapperRef?.nativeElement;
    const target = event.target as HTMLElement;

    const clickedMailIcon = target.closest('.tool-icon[alt="Mail"]');
    const clickedInsideWrapper = mailWrapperEl?.contains(target);

    if (!clickedInsideWrapper && !clickedMailIcon && this.showEmail) {
      this.showEmail = false;
    }
  }


  showEmail = false;
  showCopyDialog = false;
  emailCopied = false;

  ngOnInit() {
    this.boundCheckViewport = this.checkViewport.bind(this);
    window.addEventListener('resize', this.boundCheckViewport);
    this.checkViewport();
  }


  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  private boundCheckViewport!: () => void;


  checkViewport() {
    const isMobile = window.innerWidth <= 870;

    if (!isMobile && this.showEmail) {
      this.showEmail = false;
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
