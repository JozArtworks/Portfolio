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
  ViewChild,
  HostListener,
} from '@angular/core';

import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';
import { LinksImgComponent } from "../components/links-img/links-img.component";

import { SimpleChanges, OnChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

import { signal, effect } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent, LinksImgComponent, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  constructor(private router: Router, private translate: TranslateService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (this.justScrolled()) return;

        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        setTimeout(() => this.updateIndicator(), 10);
      });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
    if (this.observer) this.observer.disconnect();
  }

  ngAfterViewInit() {
    this.observeSections();
    setTimeout(() => {
      this.updateIndicator();
    }, 100);
  }

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);

    effect(() => {
      const section = this.sectionFromScroll();
      if (section && !this.justScrolled()) {
        this.currentUrl.set(section);
        requestAnimationFrame(() => {
          this.updateIndicator();
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSection'] && !this.justScrolled()) {
      const newVal = changes['currentSection'].currentValue;
      this.sectionFromScroll.set(newVal);
    }
  }

  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
  @ViewChild('mailWrapper') mailWrapperRef!: ElementRef;

  @Input() isMobileView = false;
  @Input() mobileMenuOpen = false;
  @Input() currentSection = '';

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() mailClicked = new EventEmitter<void>();
  @Output() forceCloseMenu = new EventEmitter<void>();

  private boundCheckViewport = this.checkViewport.bind(this);
  private justToggledViaIcon = false;

  currentUrl = signal('');
  activePos = signal({ left: 0, width: 0 });
  language = signal<'de' | 'en'>('de');
  showCopyDialog = false;
  emailCopied = false;
  activeIconName = '';
  hoveredIconName = '';
  showEmail = false;
  hidingEmail = false;
  justScrolled = signal(false);
  observer!: IntersectionObserver;
  sectionFromScroll = signal('');

  sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks'];

  showIndicator = computed(() => {
    const current = this.currentUrl();
    return this.sectionIds.includes(current);
  });

  readonly EMAIL_ANIMATION_DURATION = 250;

  navItems = [
    { path: 'home', key: 'nav.home' },
    { path: 'about', key: 'nav.about' },
    { path: 'skills', key: 'nav.skills' },
    { path: 'projects', key: 'nav.projects' },
    { path: 'feedbacks', key: 'nav.feedbacks' },
    { path: 'contact', key: 'nav.contact', isContact: true }
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

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onNavClick(sectionId: string, event: Event) {
    event.preventDefault();
    this.justScrolled.set(true);
    this.scrollToSection(sectionId);
    this.currentUrl.set(sectionId);
    setTimeout(() => {
      this.justScrolled.set(false);
      this.updateIndicator();
    }, 300);
  }

  observeSections() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.justScrolled()) {
          const id = entry.target.getAttribute('id');
          if (id && this.sectionIds.includes(id)) {
            this.currentUrl.set(id);
            requestAnimationFrame(() => {
              this.updateIndicator();
            });
          }
        }
      });
    }, options);
    this.sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

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

  onRouteClick() {
    this.currentUrl.set('/contact');
    this.updateIndicator();
  }

  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang);
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
    const activeLink = this.navLinks.find(link => {
      const sectionId = link.nativeElement.getAttribute('data-section-id');
      return sectionId === this.currentUrl().replace(/^\/?#/, '');
    });
    this.navLinks.forEach(link => {
      const sectionId = link.nativeElement.getAttribute('data-section-id');
      const isActive = sectionId === this.currentUrl();
      link.nativeElement.classList.toggle('active', isActive);
    });
    if (activeLink) {
      const el = activeLink.nativeElement;
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