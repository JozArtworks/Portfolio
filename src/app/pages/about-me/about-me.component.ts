import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit, OnDestroy {

  slogans: string[] = [];
  currentSlogan = '';
  sloganIndex = 0;
  animationState: 'fade-in' | 'fade-out' = 'fade-in';

  private sloganInterval?: ReturnType<typeof setInterval>;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadSlogans();
    this.startSloganCycle();
    this.translate.onLangChange.subscribe(() => {
      this.loadSlogans();
    });
  }

  ngOnDestroy(): void {
    if (this.sloganInterval) {
      clearInterval(this.sloganInterval);
    }
  }

  private loadSlogans(): void {
    this.translate.get('about.slogans').subscribe((slogans: string[]) => {
      this.slogans = slogans;
      this.sloganIndex = 0;
      this.currentSlogan = slogans[0];
      this.animationState = 'fade-in';
    });
  }

  private startSloganCycle(): void {
    this.sloganInterval = setInterval(() => {
      this.animationState = 'fade-out';
      setTimeout(() => {
        this.sloganIndex = (this.sloganIndex + 1) % this.slogans.length;
        this.currentSlogan = this.slogans[this.sloganIndex];
        this.animationState = 'fade-in';
      }, 400);
    }, 7000);
  }

}
