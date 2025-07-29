import { Component, HostListener, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from '../pages/about-me/about-me.component';
import { SkillsComponent } from '../pages/skills/skills.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { FeedbacksComponent } from '../pages/feedbacks/feedbacks.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { Output, EventEmitter } from '@angular/core';
import { SectionObserverService } from './../../assets/services/section-observer.service';
import { effect } from '@angular/core';
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

  @Input() isAppReadyForTransition = false;
  @Output() sectionChanged = new EventEmitter<string>();
  sectionIds = ['home', 'about', 'skills', 'projects', 'feedbacks', 'contact'];


  constructor(public sectionObserver: SectionObserverService) {
    effect(() => {
      const current = this.sectionObserver.currentSection();
      this.sectionChanged.emit(current);
    });
  }


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