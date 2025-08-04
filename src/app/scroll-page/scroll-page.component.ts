import { Component, HostListener, AfterViewInit, Input, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from '../pages/about-me/about-me.component';
import { SkillsComponent } from '../pages/skills/skills.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { FeedbacksComponent } from '../pages/feedbacks/feedbacks.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { SectionObserverService } from '../shared/services/section-observer.service';

/**
 * Component that renders all scrollable sections of the portfolio.
 * Tracks visibility of sections using the SectionObserverService
 * and emits updates to the parent component.
 *
 * Sections included:
 * - Landing
 * - About Me
 * - Skills
 * - Projects
 * - Feedbacks
 * - Contact
 *
 * Also handles quantum Easter Egg trigger from Contact section.
 */
@Component({
  selector: 'app-scroll-page',
  standalone: true,
  imports: [
    CommonModule,
    LandingComponent,
    AboutMeComponent,
    SkillsComponent,
    ProjectsComponent,
    FeedbacksComponent,
    ContactComponent
  ],
  templateUrl: './scroll-page.component.html',
  styleUrls: ['./scroll-page.component.scss']
})

export class ScrollPageComponent implements AfterViewInit {

  /**
   * Whether the app is ready to perform visual transitions.
   * Used to delay animations until the initial state is ready.
   */
  @Input() isAppReadyForTransition = false;

  /**
   * Emits the current section ID whenever the visible section changes.
   * Can be used by parent components to update navigation or background.
   */
  @Output() sectionChanged = new EventEmitter<string>();

  /**
   * Emits an event when the Contact section triggers the Easter Egg.
   */
  @Output() quantumPingTriggered = new EventEmitter<void>();

  /**
   * List of section IDs that are scroll-observed.
   */
  sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks', 'contact'];

  /**
   * Constructor subscribes to the SectionObserverService to emit section changes.
   *
   * @param sectionObserver - Service that tracks which section is currently visible
   */
  constructor(public sectionObserver: SectionObserverService) {
    effect(() => {
      const current = this.sectionObserver.currentSection();
      this.sectionChanged.emit(current);
    });
  }

  /**
   * Triggers the quantum ping from inside the Contact section.
   * Emits an event to be handled by the parent component (e.g. AppComponent).
   */
  triggerQuantumPingFromScrollPage(): void {
    this.quantumPingTriggered.emit();
  }

  /**
   * After the component's view is initialized:
   * - Starts observing all defined sections
   * - Detects and sets the initial section (usually "home")
   * - Marks the app as ready for animations after a short delay
   */
  ngAfterViewInit(): void {
    this.sectionObserver.observeSections(this.sectionIds);
    const homeEl = document.getElementById('home');
    if (homeEl) {
      const rect = homeEl.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom > 200) {
        this.sectionObserver.currentSection.set('home');
        this.sectionChanged.emit('home');
      }
    }
    setTimeout(() => {
      this.isAppReadyForTransition = true;
    }, 100);
  }
}
