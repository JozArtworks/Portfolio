import { Component, Output, Input, EventEmitter } from '@angular/core';
import { linksIcons, LinkIcon } from '../../../shared/data/links-icons.data';

@Component({
  selector: 'app-links-img',
  standalone: true,
  imports: [],
  templateUrl: './links-img.component.html',
  styleUrl: './links-img.component.scss'
})
export class LinksImgComponent {

  @Output() mailClicked = new EventEmitter<void>();

  @Input() isEmailVisible = false;

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



  getIconSrc(icon: { name: string }) {
    const base = icon.name.toLowerCase();
    const isHovered = this.hoveredIconName === icon.name;
    const isActiveMail = icon.name === 'Mail' && this.isEmailVisible;


    const folder = (isHovered || isActiveMail) ? 'green' : 'white';

    return `assets/icons/${folder}/${base}_${folder}.png`;
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
  }

}
