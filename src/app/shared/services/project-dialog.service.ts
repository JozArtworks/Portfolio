import { Injectable, signal } from '@angular/core';
import { Project } from '../../pages/projects/project.interface';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectDialogService {

  private closedSubject = new Subject<void>();
  closedDialog = this.closedSubject.asObservable();

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

  close(lastProject?: Project | null) {
    if (lastProject) {
      this.currentProjectSignal.set(lastProject);
    } else {
      this.currentProjectSignal.set(null);
    }
    this.dialogOpenSignal.set(false);
    this.closedSubject.next();
  }

  change(project: Project) {
    this.currentProjectSignal.set(project);
  }

}
