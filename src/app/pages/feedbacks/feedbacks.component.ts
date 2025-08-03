import { Component, ChangeDetectorRef } from '@angular/core';
import { FEEDBACKS } from './../../shared/data/feedbacks.data';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent {

  constructor(private cdr: ChangeDetectorRef) { }

  feedbacks = FEEDBACKS;
  hoveredEntryKey: string | null = null;

  setHover(key: string) {
    this.hoveredEntryKey = key;
  }

  clearHover() {
    this.hoveredEntryKey = null;
    this.cdr.detectChanges();
  }

  onTouchEnd() {
    setTimeout(() => {
      this.clearHover();
    }, 100);
  }

}
