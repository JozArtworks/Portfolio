import { Injectable, signal } from '@angular/core';
import { Project } from './../../app/pages/projects/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectDialogService {

  private dialogOpenSignal = signal(false);
  private allProjectsSignal = signal<Project[]>([]);
  private currentProjectSignal = signal<Project | null>(null);

  dialogOpen = () => this.dialogOpenSignal();
  allProjects = () => this.allProjectsSignal();
  currentProject = () => this.currentProjectSignal();


  open(project?: Project, allProjects?: Project[]) {
    if (project) this.currentProjectSignal.set(project);
    if (allProjects) this.allProjectsSignal.set(allProjects);
    this.dialogOpenSignal.set(true);
  }

  close() {
    this.dialogOpenSignal.set(false);
  }

  change(project: Project) {
    this.currentProjectSignal.set(project);
  }
}
