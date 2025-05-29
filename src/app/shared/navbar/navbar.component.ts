import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  computed,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterViewInit {

  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;

  activePos = signal({ left: 0, width: 0 });
  currentUrl = signal('');
  showIndicator = computed(() => !this.currentUrl().includes('/contact'));

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        setTimeout(() => this.updateIndicator(), 10);
      });
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
  }

  updateIndicator(): void {
    const active = this.navLinks.find((link) =>
      link.nativeElement.classList.contains('active')
    );
    if (active) {
      const navLink = active.nativeElement;
      this.activePos.set({
        left: navLink.offsetLeft,
        width: navLink.offsetWidth,
      });
    }
  }
}
