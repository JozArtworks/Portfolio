import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { LinksImgComponent } from "../../shared/components/links-img/links-img.component";
import { TranslateModule } from '@ngx-translate/core';
import { toolsIcons, ToolIcon } from '../../shared/data/tools-icons.data';
import { signal } from '@angular/core';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LinksImgComponent, TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  @Input() scrolledAway = false;


  toolsIcons: ToolIcon[] = toolsIcons;
  showEmail = false;
  emailCopied = false;
  showCopyDialog = false;

  private justToggledViaIcon = false;
  private boundCheckViewport = this.checkViewport.bind(this);

  @Input() isMobileView = false;
  @ViewChild('mailWrapper') mailWrapperRef?: ElementRef;

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

  @HostListener('document:keydown.escape')
  closeEmail() {
    if (this.showEmail) this.showEmail = false;
  }

  toggleEmail() {
    if (this.showCopyDialog) {
      return;
    }
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

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
    if (!this.isMobileView && this.showEmail) {
      this.showEmail = false;
    }
  }



}
