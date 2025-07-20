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
import { NavigationEnd } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { LangSwitchComponent } from '../components/lang-switch/lang-switch.component';
import { LinksImgComponent } from "../components/links-img/links-img.component";
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { signal, effect } from '@angular/core';
import { inject, runInInjectionContext } from '@angular/core';
import { EnvironmentInjector } from '@angular/core';
import { SectionObserverService } from '../../../assets/services/section-observer.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LangSwitchComponent, LinksImgComponent, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private translate: TranslateService,
    private sectionObserver: SectionObserverService
  ) { }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckViewport);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sectionObserver.observeSections(this.sectionIds);
    });
    setTimeout(() => {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          console.log('Aktuelle Section:', this.currentUrl());
          this.updateIndicator();
        }, { allowSignalWrites: true });
      });
    });
  }

  setupEffect() {
    effect(() => {
      const section = this.currentUrl();
      this.updateIndicator();
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.boundCheckViewport);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        const isScroll = url === '/' || url.startsWith('/#');
        this.isScrollPage.set(isScroll);
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        const isScroll = url === '/' || url.startsWith('/#');
        this.isScrollPage.set(isScroll);
        if (!isScroll) {
          const cleanPath = url.split('/')[1];
          this.sectionObserver.setCurrentSection(cleanPath);
        }
      }
    });
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

  activePos = signal({ left: 0, width: 0 });
  language = signal<'de' | 'en'>('de');
  showCopyDialog = false;
  emailCopied = false;
  activeIconName = '';
  hoveredIconName = '';
  showEmail = false;
  hidingEmail = false;
  currentUrl = this.sectionObserver.currentSection;
  sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks'];
  isScrollPage = signal(false);
  injector = inject(EnvironmentInjector);
  showIndicator = computed(() => {
    const current = this.currentUrl();
    return this.sectionIds.includes(current) && this.isScrollPage();
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

  onNavClick(path: string, event: MouseEvent) {
    event.preventDefault();
    const el = document.getElementById(path);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.ifMobileOpenToggle();
  }

  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang).subscribe(() => this.updateIndicator());
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
    if (!this.navLinks || this.navLinks.length === 0) return;
    const activeLink = this.navLinks.find(link => {
      const sectionId = link.nativeElement.getAttribute('data-section-id');
      return sectionId === this.currentUrl();
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

