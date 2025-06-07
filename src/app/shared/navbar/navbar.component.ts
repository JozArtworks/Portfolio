import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';
import { LinksImgComponent } from "../components/links-img/links-img.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent, LinksImgComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        setTimeout(() => this.updateIndicator(), 10);
      });
  }

  // === View + Inputs/Outputs ===
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
  @Input() isMobileView = false;
  @Input() mobileMenuOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() mailClicked = new EventEmitter<void>();


  // === Reactive state ===
  currentUrl = signal('');
  activePos = signal({ left: 0, width: 0 });
  language = signal<'de' | 'en'>('de');
  showIndicator = computed(() => !this.currentUrl().includes('/contact'));

  // === Translations ===
  readonly translations = {
    de: {
      home: 'Home',
      about: 'Über mich',
      skills: 'Tools',
      projects: 'Projekte',
      feedbacks: 'Referenzen',
      contact: 'KONTAKT',
    },
    en: {
      home: 'Home',
      about: 'About me',
      skills: 'Skills',
      projects: 'Projects',
      feedbacks: 'References',
      contact: 'CONTACT',
    },
  };

  get translate() {
    return this.translations[this.language()];
  }

  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    setTimeout(() => this.updateIndicator(), 20);
  }

  // === Navigation links ===
  navItems = [
    { path: '/home', label: () => this.translate.home },
    { path: '/about', label: () => this.translate.about },
    { path: '/skills', label: () => this.translate.skills },
    { path: '/projects', label: () => this.translate.projects },
    { path: '/feedbacks', label: () => this.translate.feedbacks },
  ];

  // === Social Icons ===
  linksIcons = [
    {
      name: 'GitHub',
      icon: 'assets/icons/white/github_white.png',
      link: 'https://github.com/JozArtworks',
      interactive: false,
    },
    {
      name: 'Mail',
      icon: 'assets/icons/white/mail_white.png',
      interactive: true,
    },
    {
      name: 'Linkedin',
      icon: 'assets/icons/white/linkedin_white.png',
      link: 'https://www.linkedin.com/in/jonathan-michutta-527722210/',
      interactive: false,
    },
  ];

  // === Mobile toggle ===
  emitToggleMenu() {
    this.toggleMenu.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  ifMobileOpenToggle() {
    if (this.isMobileView && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  // === Viewport handling ===
  private boundCheckViewport = this.checkViewport.bind(this);

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

  // === Nav indicator ===
  ngAfterViewInit() {
    this.updateIndicator();
  }

  updateIndicator() {
    const active = this.navLinks.find(link =>
      link.nativeElement.classList.contains('active')
    );

    if (active) {
      const el = active.nativeElement;
      this.activePos.set({ left: el.offsetLeft, width: el.offsetWidth });
    } else {
      this.activePos.set({ left: 0, width: 0 });
    }
  }

  // === Hover states for icons ===
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

  getIconSrc(icon: { name: string; interactive?: boolean }) {
    const base = icon.name.toLowerCase();
    const isHovered = this.hoveredIconName === icon.name;
    const isActive = icon.interactive && this.activeIconName === icon.name;
    const colorFolder = isHovered || isActive ? 'green' : 'white';
    return `assets/icons/${colorFolder}/${base}_${colorFolder}.png`;
  }

  showEmail = false;

  toggleEmail() {
    this.showEmail = true;
    setTimeout(() => this.showEmail = false, 4000);
  }
}
