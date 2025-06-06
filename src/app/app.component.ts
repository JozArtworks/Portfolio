import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';

  currentRoute = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  getBackgroundClass() {
    if (this.currentRoute.includes('/about')) return 'bg-about';
    if (this.currentRoute.includes('/skills')) return 'bg-skills';
    if (this.currentRoute.includes('/projects')) return 'bg-projects';
    if (this.currentRoute.includes('/feedbacks')) return 'bg-feedbacks';
    if (this.currentRoute.includes('/contact')) return 'bg-contact';
    return 'bg-home';
  }
}
