import { Component, Input, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { LinksImgComponent } from "../../shared/components/links-img/links-img.component";
import { TranslateModule } from '@ngx-translate/core';
import { toolsIcons, ToolIcon } from '../../shared/data/tools-icons.data';
import { MailToastComponent } from '../../shared/components/mail-toast/mail-toast.component';
import { inject, computed } from '@angular/core';
import { MailToastService } from '../../shared/services/mail-toast.service';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LinksImgComponent, TranslateModule, MailToastComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnChanges {

  private boundCheckViewport = this.checkViewport.bind(this);
  public mailToastService = inject(MailToastService);
  private justToggledViaIcon = false;

  context: 'landing' = 'landing';


  showBoxes = false;
  toolsIcons: ToolIcon[] = toolsIcons;
  showEmail = this.mailToastService.showEmail;
  emailCopied = this.mailToastService.emailCopied;
  showCopyDialog = this.mailToastService.showCopyDialog;

  @Input() isAppReadyForTransition = false;
  @Input() scrolledAway = false;

  @ViewChild('mailWrapper') mailWrapperRef?: ElementRef;

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  checkViewport() {
    const isMobile = window.innerWidth <= 870;
    if (isMobile && this.showEmail()) {
      this.onEmailClosed();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isAppReadyForTransition']?.currentValue) {
      setTimeout(() => {
        this.showBoxes = true;
      }, 400);
    }
    if (changes['scrolledAway']?.currentValue === true) {
      this.onEmailClosed();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (this.justToggledViaIcon) {
      this.justToggledViaIcon = false;
      return;
    }
  }

  toggleEmail() {
    this.justToggledViaIcon = true;
    this.mailToastService.toggleEmail('landing');
  }


  onEmailCopied() {
    this.mailToastService.triggerCopySuccess();
  }

  onEmailClosed() {
    this.mailToastService.closeEmail();
  }

  get filteredToolsIcons(): ToolIcon[] {
    return this.toolsIcons.filter((_, i) => i !== this.toolsIcons.length - 3);
  }

  showLandingToast = computed(() =>
    (this.mailToastService.showEmail() || this.mailToastService.showCopyDialog()) &&
    this.mailToastService.currentContext() === 'landing'
  );

}
