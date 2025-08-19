import { Injectable, signal } from '@angular/core';

/**
 * Service that observes scroll-based section visibility using IntersectionObserver.
 * Tracks the currently visible section and handles smooth scroll behavior.
 */
@Injectable({ providedIn: 'root' })
export class SectionObserverService {
  /**
   * The IntersectionObserver instance tracking sections.
   */
  private observer!: IntersectionObserver;

  /**
   * Signal holding the ID of the currently visible section.
   */
  private currentSectionSignal = signal('home');

  /**
   * Signal indicating if a programmatic scroll is in progress.
   */
  private justScrolledSignal = signal(false);

  /**
   * Gets the signal for the current section.
   */
  get currentSection() {
    return this.currentSectionSignal;
  }

  /**
   * Gets the signal indicating whether the user just scrolled programmatically.
   */
  get justScrolled() {
    return this.justScrolledSignal;
  }

  /**
   * Updates the current section ID.
   * @param sectionId The ID of the section now in view.
   */
  setCurrentSection(sectionId: string): void {
    this.currentSectionSignal.set(sectionId);
  }

  /**
   * Starts observing the given section elements for visibility changes.
   * @param sectionIds List of section IDs to observe.
   */
  observeSections(sectionIds: string[]): void {
    if (this.observer) this.observer.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.justScrolled()) {
            const id = entry.target.getAttribute('id');
            if (id && sectionIds.includes(id)) {
              this.setCurrentSection(id);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  /**
   * Smoothly scrolls to a given section and updates signals accordingly.
   * @param sectionId The target section to scroll to.
   * @param duration Duration in ms before resetting scroll signal (default: 400).
   */
  scrollToSection(sectionId: string, duration: number = 400): void {
    const target = document.getElementById(sectionId);
    if (!target) return;

    this.justScrolledSignal.set(true);
    target.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      this.justScrolledSignal.set(false);
      this.setCurrentSection(sectionId);
    }, duration);
  }
  
}
