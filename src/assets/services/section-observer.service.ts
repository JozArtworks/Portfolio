import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
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

  setCurrentSection(sectionId: string) {
  this.currentSectionSignal.set(sectionId);
}

  observeSections(sectionIds: string[]) {
    if (this.observer) this.observer.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.justScrolledSignal()) {
            const id = entry.target.getAttribute('id');
            if (id && sectionIds.includes(id)) {
              this.currentSectionSignal.set(id);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      this.justScrolledSignal.set(true);
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        this.justScrolledSignal.set(false);
        this.currentSectionSignal.set(sectionId);
      }, 300);
    }
  }

  
}

