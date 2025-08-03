import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SectionObserverService {

  private observer!: IntersectionObserver;
  private currentSectionSignal = signal('home');
  private justScrolledSignal = signal(false);

  get currentSection() {
    return this.currentSectionSignal;
  }

  get justScrolled() {
    return this.justScrolledSignal;
  }

  setCurrentSection(sectionId: string): void {
    this.currentSectionSignal.set(sectionId);
  }

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
