import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-me/about-me.component').then((m) => m.AboutMeComponent),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./pages/skills/skills.component').then((m) => m.SkillsComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'feedbacks',
    loadComponent: () =>
      import('./pages/feedbacks/feedbacks.component').then((m) => m.FeedbacksComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'legal/imprint',
    loadComponent: () =>
      import('./pages/legal/imprint/imprint.component').then((m) => m.ImprintComponent),
  },
  {
    path: 'legal/privacy-policy',
    loadComponent: () =>
      import('./pages/legal/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
  },
];
