import { Component, Input, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { LinksImgComponent } from "../../shared/components/links-img/links-img.component";
import { TranslateModule } from '@ngx-translate/core';
import { toolsIcons, ToolIcon } from '../../shared/data/tools-icons.data';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LinksImgComponent, TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnChanges {

  @Input() scrolledAway = false;

  @ViewChild('mailWrapper') mailWrapperRef?: ElementRef;

  toolsIcons: ToolIcon[] = toolsIcons;
  showEmail = false;
  emailCopied = false;
  showCopyDialog = false;

  private isMobileView = false;
  private justToggledViaIcon = false;
  private boundCheckViewport = this.checkViewport.bind(this);

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrolledAway'] && changes['scrolledAway'].currentValue === true) {
      this.showEmail = false;
      this.showCopyDialog = false;
    }
  }

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

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
    if (!this.isMobileView && this.showEmail) {
      this.showEmail = false;
    }
  }

}
