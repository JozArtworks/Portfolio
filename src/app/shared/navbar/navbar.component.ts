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
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';
import { LinksImgComponent } from "../components/links-img/links-img.component";

import { SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent, LinksImgComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy, OnInit, OnChanges {

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

  navItems = [
    { path: '/home', label: () => this.translate.home },
    { path: '/about', label: () => this.translate.about },
    { path: '/skills', label: () => this.translate.skills },
    { path: '/projects', label: () => this.translate.projects },
    { path: '/feedbacks', label: () => this.translate.feedbacks },
  ];

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

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        setTimeout(() => this.updateIndicator(), 10);
      });
  }

  private boundCheckViewport = this.checkViewport.bind(this);
  private justToggledViaIcon = false;

  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
  @ViewChild('mailWrapper') mailWrapperRef!: ElementRef;

  @Input() isMobileView = false;
  @Input() mobileMenuOpen = false;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() mailClicked = new EventEmitter<void>();
  @Output() forceCloseMenu = new EventEmitter<void>();

  currentUrl = signal('');
  activePos = signal({ left: 0, width: 0 });
  language = signal<'de' | 'en'>('de');
  showIndicator = computed(() => !this.currentUrl().includes('/contact'));
  showCopyDialog = false;
  emailCopied = false;
  activeIconName = '';
  hoveredIconName = '';
  showEmail = false;
  hidingEmail = false;

  readonly EMAIL_ANIMATION_DURATION = 250;

@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  if (this.justToggledViaIcon) {
    this.justToggledViaIcon = false;
    return;
  }

  const target = event.target as HTMLElement;
  const clickedInsideWrapper = target.closest('.mail-wrapper');
  const clickedMailIcon = target.closest('.box-link-nav-mobile img');

  if (!clickedInsideWrapper && !clickedMailIcon && this.showEmail) {
    this.hidingEmail = true;

    setTimeout(() => {
      this.showEmail = false;
      this.hidingEmail = false;
    }, this.EMAIL_ANIMATION_DURATION);
  }
}


  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  ngAfterViewInit() {
    this.updateIndicator();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mobileMenuOpen']) {
      const nowOpen = changes['mobileMenuOpen'].currentValue;
      if (nowOpen && this.showEmail) {
        this.showEmail = false;
      }
    }
  }

  get translate() {
    return this.translations[this.language()];
  }

  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    setTimeout(() => this.updateIndicator(), 20);
  }

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

  checkViewport() {
    this.isMobileView = window.innerWidth <= 870;

    if (!this.isMobileView && this.showEmail) {
      this.showEmail = false;
    }

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

toggleEmail() {
  if (this.showCopyDialog) {
    return;
  }

  this.justToggledViaIcon = true;

  if (this.showEmail) {
    this.hidingEmail = true;
    setTimeout(() => {
      this.showEmail = false;
      this.hidingEmail = false;
    }, this.EMAIL_ANIMATION_DURATION);
  } else {
    this.showEmail = true;
  }
}

  copyEmail() {
    const email = 'front-dev@jonathan-michutta.de';
    navigator.clipboard.writeText(email).then(() => {
      this.emailCopied = true;
      this.showEmail = false;
      this.showCopyDialog = true;

      setTimeout(() => {
        this.showCopyDialog = false;
        this.emailCopied = false;
      }, 1000);
    });
  }

  handleIconClick(name: string) {
    this.setActiveIcon(name);

    if (this.isMobileView && this.mobileMenuOpen) {
      this.forceCloseMenu.emit();
    }

    if (this.showEmail) {
      this.showEmail = false;
    }
  }

}

