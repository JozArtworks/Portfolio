import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // beide hier zusammen



@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  slogans: string[] = [];
  currentSlogan = '';
  sloganIndex = 0;
  animationState: 'fade-in' | 'fade-out' = 'fade-in';

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.translate.get('about.slogans').subscribe((slogans: string[]) => {
      this.slogans = slogans;
      this.currentSlogan = this.slogans[0];
      this.startSloganCycle();
    });

    this.translate.onLangChange.subscribe(() => {
      this.translate.get('about.slogans').subscribe((slogans: string[]) => {
        this.slogans = slogans;
        this.sloganIndex = 0;
        this.currentSlogan = slogans[0];
      });
    });
  }

  startSloganCycle() {
    setInterval(() => {
      this.animationState = 'fade-out';
      setTimeout(() => {
        this.sloganIndex = (this.sloganIndex + 1) % this.slogans.length;
        this.currentSlogan = this.slogans[this.sloganIndex];
        this.animationState = 'fade-in';
      }, 400);
    }, 7000);
  }

}
