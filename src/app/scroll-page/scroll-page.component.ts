import { Component, HostListener, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from '../pages/about-me/about-me.component';
import { SkillsComponent } from '../pages/skills/skills.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { FeedbacksComponent } from '../pages/feedbacks/feedbacks.component';
import { ContactComponent } from '../pages/contact/contact.component';

import { LandingComponent } from '../pages/landing/landing.component';

import { Output, EventEmitter } from '@angular/core';

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
export class ScrollPageComponent {
  currentSection = signal('home');

  @HostListener('window:scroll', [])


  @Output() sectionChanged = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onScroll() {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks', 'contact'];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > 200) {
          this.currentSection.set(id);
          this.sectionChanged.emit(id);
          break;
        }
      }
    }

  }
}