import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router,) { }

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

}
