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

  /**
   * Array of translated slogans shown in rotation.
   */
  slogans: string[] = [];

  /**
   * The currently visible slogan.
   */
  currentSlogan = '';

  /**
   * Index of the current slogan in the array.
   */
  sloganIndex = 0;

  /**
   * Animation state used for fade-in/fade-out transitions.
   */
  animationState: 'fade-in' | 'fade-out' = 'fade-in';

  /**
   * Interval handler for the slogan rotation timer.
   */
  private sloganInterval?: ReturnType<typeof setInterval>;

  /**
   * Initializes the component with translation support and slogan rotation.
   * @param translate The translation service from ngx-translate
   */
  constructor(private translate: TranslateService) { }

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Sets up slogans and subscribes to language change events.
   */
  ngOnInit(): void {
    this.loadSlogans();
    this.startSloganCycle();
    this.translate.onLangChange.subscribe(() => {
      this.loadSlogans();
    });
  }

  /**
   * Angular lifecycle hook that runs on component destruction.
   * Clears the slogan interval to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.sloganInterval) {
      clearInterval(this.sloganInterval);
    }
  }

  /**
   * Loads the translated slogans from the translation files.
   * Resets the index and sets the first slogan.
   */
  private loadSlogans(): void {
    this.translate.get('about.slogans').subscribe((slogans: string[]) => {
      this.slogans = slogans;
      this.sloganIndex = 0;
      this.currentSlogan = slogans[0];
      this.animationState = 'fade-in';
    });
  }

  /**
   * Starts the interval loop that cycles through slogans every 7 seconds.
   * Handles fade-out and fade-in transitions between slogans.
   */
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