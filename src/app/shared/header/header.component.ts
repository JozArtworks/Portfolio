import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() currentSection = 'home';
  @Input() isMobileView = false;
  @Input() mobileMenuOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() mailClicked = new EventEmitter<void>();
  @Output() forceCloseMenu = new EventEmitter<void>();

  onToggleMenu() {
    this.toggleMenu.emit();
  }

  onMailClicked() {
    this.mailClicked.emit();
  }

  onForceCloseMenu() {
    this.forceCloseMenu.emit();
  }
}
