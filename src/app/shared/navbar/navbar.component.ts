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

  linksIcons = [
    { name: 'GitHub', icon: 'assets/icons/white/github_white.png', link: 'https://github.com/JozArtworks', interactive: false },
    { name: 'Mail', icon: 'assets/icons/white/mail_white.png', interactive: true },
    { name: 'Linkedin', icon: 'assets/icons/white/linkedin_white.png', link: 'https://www.linkedin.com/in/jonathan-michutta-527722210/', interactive: false },
  ];



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
    setTimeout(() => this.updateIndicator(), 20);
  }

  ifMobileOpenToggle() {
    if (this.isMobileView && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }


  boundCheckViewport = this.checkViewport.bind(this);

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
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

  getIconSrc(icon: { name: string; link?: string; interactive?: boolean }) {
    const base = icon.name.toLowerCase();
    const isHovered = this.hoveredIconName === icon.name;
    const isActive = icon.interactive && this.activeIconName === icon.name;

    const colorFolder = (isHovered || isActive) ? 'green' : 'white';
    return `assets/icons/${colorFolder}/${base}_${colorFolder}.png`;
  }


}
