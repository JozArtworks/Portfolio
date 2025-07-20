import { Component, Output, Input, EventEmitter } from '@angular/core';
import { linksIcons, LinkIcon } from '../../../shared/data/links-icons.data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-links-img',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './links-img.component.html',
  styleUrl: './links-img.component.scss'
})
export class LinksImgComponent {

  @Output() mailClicked = new EventEmitter<void>();

  @Input() isEmailVisible = false;
  @Input() showCopyDialog = false;
  @Input() context: 'home' | 'contact' = 'home';

  hoveredIconName = '';
  isMobileView = false;
  mobileMenuOpen = false;
  linksIcons: LinkIcon[] = linksIcons;

  setHoveredIcon(name: string) {
    this.hoveredIconName = name;
  }

  clearHoveredIcon() {
    this.hoveredIconName = '';
  }

  getIconSrc(icon: LinkIcon): string {
    const isHovered = this.hoveredIconName === icon.name;
    const isActiveMail = icon.name === 'Mail' && this.isEmailVisible;
    if (isHovered || isActiveMail) {
      return icon.hoverIcon || icon.icon;
    }
    return icon.icon;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ifMobileOpenToggle() {
    if (this.isMobileView && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  handleIconClick(iconName: string) {
    if (iconName === 'Mail') {
      this.mailClicked.emit();
    }
    this.clearHoveredIcon();
  }
}
