import { Injectable, signal } from '@angular/core';
import { Project } from '../../pages/projects/project.interface';
import { Subject } from 'rxjs';

/**
 * Service that manages the state of the project detail dialog.
 * Handles opening, closing, project navigation, and provides reactive access to the dialog state.
 */
@Injectable({ providedIn: 'root' })
export class ProjectDialogService {

  /** Emits when the dialog is closed, e.g. to restore focus or cleanup effects */
  private closedSubject = new Subject<void>();

  /** Observable for subscribers to react to dialog close events */
  closedDialog = this.closedSubject.asObservable();

  /** Signal tracking whether the dialog is currently open */
  private dialogOpenSignal = signal(false);

  /** Signal holding the full list of available projects */
  private allProjectsSignal = signal<Project[]>([]);

  /** Signal storing the currently selected project */
  private currentProjectSignal = signal<Project | null>(null);

  /**
   * Returns whether the dialog is currently open.
   */
  dialogOpen = () => this.dialogOpenSignal();

  /**
   * Returns the full list of available projects.
   */
  allProjects = () => this.allProjectsSignal();

  /**
   * Returns the currently selected project, or null if none is selected.
   */
  currentProject = () => this.currentProjectSignal();

  /**
   * Opens the project dialog.
   *
   * @param project - The project to display in the dialog.
   * @param allProjects - Optional list of all projects for navigation support.
   */
  open(project?: Project, allProjects?: Project[]) {
    if (project) this.currentProjectSignal.set(project);
    if (allProjects) this.allProjectsSignal.set(allProjects);
    this.dialogOpenSignal.set(true);
  }

  /**
   * Closes the project dialog and optionally updates the current project.
   *
   * @param lastProject - The last project to keep selected, or null to reset.
   */
  close(lastProject?: Project | null) {
    if (lastProject) {
      this.currentProjectSignal.set(lastProject);
    } else {
      this.currentProjectSignal.set(null);
    }
    this.dialogOpenSignal.set(false);
    this.closedSubject.next();
  }

  /**
   * Updates the current project to the specified one.
   *
   * @param project - The new project to set as current.
   */
  change(project: Project) {
    this.currentProjectSignal.set(project);
  }
}