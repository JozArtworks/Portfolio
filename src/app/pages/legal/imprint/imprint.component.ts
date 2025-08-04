import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { LangSwitchComponent } from '../../../shared/components/lang-switch/lang-switch.component';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule, TranslateModule, LangSwitchComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(private translate: TranslateService, private router: Router, private title: Title) { this.setTranslatedTitle(); }

  language = signal<'de' | 'en'>('de');
  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';

  setTranslatedTitle() {
  this.translate.get('titles.imprint').subscribe((translatedTitle: string) => {
    this.title.setTitle(translatedTitle);
  });
}


  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang);
  }

  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  scrollToContact(event?: Event) {
    event?.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.scrollToContact();
  }

}
