import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { LinksImgComponent } from "../../shared/components/links-img/links-img.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LinksImgComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  toolsIcons = [
    { name: 'Api', icon: 'assets/icons/white/api_white.png' },
    { name: 'JavaScript', icon: 'assets/icons/white/javascript_white.png' },
    { name: 'HTML', icon: 'assets/icons/white/html_white.png' },
    { name: 'Git', icon: 'assets/icons/white/git_white.png' },


    { name: 'Scrum', icon: 'assets/icons/white/scrum_white.png' },
    { name: 'CSS', icon: 'assets/icons/white/css_white.png' },
    { name: 'TypeScript', icon: 'assets/icons/white/typescript_white.png' },
    { name: 'Firebase', icon: 'assets/icons/white/firebase_white.png' },
    { name: 'Angular', icon: 'assets/icons/white/angular_white.png' },
    { name: 'Material Design', icon: 'assets/icons/white/material_white.png' },
  ];

  linksIcons = [
    { name: 'GitHub', icon: 'assets/icons/white/github_white.png' },
    { name: 'Mail', icon: 'assets/icons/white/mail_white.png' },
    { name: 'Linkedin', icon: 'assets/icons/white/linkedin_white.png' },
  ];

  showEmail = false;
  emailCopied = false;
  showCopyDialog = false;

  @ViewChild('mailWrapper') mailWrapperRef?: ElementRef;

  private justToggledViaIcon = false;


  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedInsideMail = this.mailWrapperRef?.nativeElement.contains(event.target);

    if (this.justToggledViaIcon) {
      this.justToggledViaIcon = false;
      return;
    }

    if (this.showEmail && !clickedInsideMail) {
      this.showEmail = false;
    }
  }



  toggleEmail() {
    this.justToggledViaIcon = true;
    this.showEmail = !this.showEmail;
  }

  copyEmail() {
    const email = 'front-dev@jonathan-michutta.de';
    navigator.clipboard.writeText(email).then(() => {
      this.emailCopied = true;
      this.showEmail = false;
      this.showCopyDialog = true;

      setTimeout(() => {
        this.emailCopied = false;
        this.showCopyDialog = false;
      }, 2000);
    });
  }



  @Input() isMobileView = false;

  private boundCheckViewport = this.checkViewport.bind(this);

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;

    if (!this.isMobileView && this.showEmail) {
      this.showEmail = false;
    }

  }


}
