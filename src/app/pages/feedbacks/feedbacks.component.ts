import { Component, ChangeDetectorRef } from '@angular/core';
import { FEEDBACKS } from './../../shared/data/feedbacks.data';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

/**
 * Component: FeedbacksComponent
 *
 * Displays a list of feedback entries including translated text, author names,
 * and optional LinkedIn profile links. Includes hover/touch logic for dynamic
 * icon switching and accessibility support.
 *
 * Used in the "References" section of the portfolio to showcase external feedback.
 */
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})

export class FeedbacksComponent {
  
  /**
   * List of feedback entries imported from shared data file.
   * Each entry contains a translated text, author name, source, and optional LinkedIn URL.
   */
  feedbacks = FEEDBACKS;

  /**
   * The key of the currently hovered or touched feedback entry.
   * Used to determine which LinkedIn icon to display in color.
   */
  hoveredEntryKey: string | null = null;

  /**
   * Creates an instance of the FeedbacksComponent.
   * @param cdr Angular's ChangeDetectorRef used to manually trigger change detection after clearing hover state.
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Sets the currently hovered feedback entry key.
   * Triggers a visual effect (e.g. colored LinkedIn icon).
   * @param key The unique identifier of the hovered feedback entry.
   */
  setHover(key: string): void {
    this.hoveredEntryKey = key;
  }

  /**
   * Clears the current hover state and manually triggers change detection.
   * Called on mouse leave, blur, or touch end.
   */
  clearHover(): void {
    this.hoveredEntryKey = null;
    this.cdr.detectChanges();
  }

  /**
   * Handles the end of a touch interaction by delaying the hover clear slightly.
   * Prevents premature icon switching on mobile.
   */
  onTouchEnd(): void {
    setTimeout(() => {
      this.clearHover();
    }, 100);
  }

}
