import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) { }

  isLogoHovered = false;

  @Input() currentSection = 'home';
  @Input() isMobileView = false;
  @Input() mobileMenuOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() mailClicked = new EventEmitter<void>();
  @Output() forceCloseMenu = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isMobileView']) {
      const newVal = changes['isMobileView'].currentValue;
      if (newVal !== this.previousMobileState) {
        this.softReloadNavbar();
        this.previousMobileState = newVal;
      }
    }
  }

  softReloadNavbar() {
    this.showNavbar.set(false);
    setTimeout(() => this.showNavbar.set(true), 0);
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }

  onMailClicked() {
    this.mailClicked.emit();
  }

  onForceCloseMenu() {
    this.forceCloseMenu.emit();
  }

  onTouchScrollToHome(event: TouchEvent) {
    event.preventDefault();
    this.scrollToHome(event);
  }

  scrollToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('home');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  private previousMobileState = window.innerWidth <= 870;
  showNavbar = signal(true);

}
