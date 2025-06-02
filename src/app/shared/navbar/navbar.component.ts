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
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements AfterViewInit {

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        setTimeout(() => this.updateIndicator(), 10);
      });
  }

  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;

  activePos = signal({ left: 0, width: 0 });
  currentUrl = signal('');
  showIndicator = computed(() => !this.currentUrl().includes('/contact'));
  isMobileView = false;
  mobileMenuOpen = false;

  readonly translations = {
    de: {
      home: 'Home',
      about: 'Über mich',
      skills: 'Tools',
      projects: 'Projekte',
      feedbacks: 'Referenzen',
      contact: 'KONTAKT'
    },
    en: {
      home: 'Home',
      about: 'About me',
      skills: 'Tools',
      projects: 'Projects',
      feedbacks: 'References',
      contact: 'CONTACT'
    }
  };

  get translate() {
    return this.translations[this.language()];
  }

  language = signal<'de' | 'en'>('de');
  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
  }


  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport.bind(this));
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
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
