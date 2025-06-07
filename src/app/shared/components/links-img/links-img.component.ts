import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-links-img',
  standalone: true,
  imports: [],
  templateUrl: './links-img.component.html',
  styleUrl: './links-img.component.scss'
})
export class LinksImgComponent {

  @Output() mailClicked = new EventEmitter<void>();


  linksIcons = [
    { name: 'GitHub', icon: 'assets/icons/white/github_white.png', link: 'https://github.com/JozArtworks', interactive: false },
    { name: 'Mail', icon: 'assets/icons/white/mail_white.png'},
    { name: 'Linkedin', icon: 'assets/icons/white/linkedin_white.png', link: 'https://www.linkedin.com/in/jonathan-michutta-527722210/', interactive: false },
  ];

  activeIconName = '';
  hoveredIconName = '';

  setActiveIcon(name: string) {
    this.activeIconName = this.activeIconName === name ? '' : name;
  }

  setHoveredIcon(name: string) {
    this.hoveredIconName = name;
  }

  clearHoveredIcon() {
    this.hoveredIconName = '';
  }

  isMobileView = false;
  mobileMenuOpen = false;

  getIconSrc(icon: { name: string; link?: string; interactive?: boolean }) {
    const base = icon.name.toLowerCase();
    const isHovered = this.hoveredIconName === icon.name;
    const isActive = icon.interactive && this.activeIconName === icon.name;

    const colorFolder = (isHovered || isActive) ? 'green' : 'white';
    return `assets/icons/${colorFolder}/${base}_${colorFolder}.png`;
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
    this.setActiveIcon(iconName);
    this.ifMobileOpenToggle();
  }

  handleMailClick() {
    this.mailClicked.emit();
  }

}
