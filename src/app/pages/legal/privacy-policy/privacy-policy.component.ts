import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { LangSwitchComponent } from '../../../shared/components/lang-switch/lang-switch.component';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, TranslateModule, LangSwitchComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  constructor(private translate: TranslateService, private router: Router) { }

  language = signal<'de' | 'en'>('de');

  setLanguage(lang: 'de' | 'en') {
    this.language.set(lang);
    this.translate.use(lang);
  }

  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';


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
