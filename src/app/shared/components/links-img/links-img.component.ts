import { Component, Output, Input, EventEmitter } from '@angular/core';


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

  linksIcons = [
    { name: 'GitHub', icon: 'assets/icons/white/github_white.png', link: 'https://github.com/JozArtworks' },
    { name: 'Mail', icon: 'assets/icons/white/mail_white.png'},
    { name: 'Linkedin', icon: 'assets/icons/white/linkedin_white.png', link: 'https://www.linkedin.com/in/jonathan-michutta-527722210/'},
  ];


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
