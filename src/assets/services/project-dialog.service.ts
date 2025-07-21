import { Injectable, signal } from '@angular/core';
import { Project } from './../../../src/app/pages/projects/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectDialogService {
  dialogOpen = signal(false);
  currentProject = signal<Project | null>(null);
  allProjects = signal<Project[]>([]);

  open(project: Project, all: Project[]) {
    this.currentProject.set(project);
    this.allProjects.set(all);
    this.dialogOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.dialogOpen.set(false);
    this.currentProject.set(null);
    document.body.style.overflow = 'auto';
  }

  change(project: Project) {
    this.currentProject.set(project);
  }
}
