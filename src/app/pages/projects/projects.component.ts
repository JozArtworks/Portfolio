import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectDialogService } from '../../shared/services/project-dialog.service';

/**
 * Displays the list of portfolio projects with description and icons.
 * Opens a project detail dialog on click or keyboard interaction.
 *
 * Features:
 * - Responsive behavior (mobile vs. desktop)
 * - Keyboard accessibility (Enter/Space)
 * - Focus restoration after dialog close
 *
 * Lifecycle:
 * - OnInit: sets up resize listener and restores focus on dialog close
 * - OnDestroy: cleans up resize listener
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  /**
   * References to all rendered project items in the list.
   * Used to restore focus after dialog close.
   */
  @ViewChildren('projectItem') projectItems!: QueryList<ElementRef<HTMLDivElement>>;

  /** List of all available project objects from shared data */
  projects = PROJECTS;

  /** Flag to determine if the current view is mobile (≤ 565px) */
  isMobileView = false;

  /** Resize event handler to toggle mobile view detection */
  private resizeListener = () => {
    this.isMobileView = window.innerWidth <= 565;
  };

  constructor(private dialog: ProjectDialogService) { }

  /**
   * Initializes the component and sets up event listeners.
   * Restores focus to the previously opened project on dialog close.
   */
  ngOnInit(): void {
    this.resizeListener();
    window.addEventListener('resize', this.resizeListener);
    this.dialog.closedDialog.subscribe(() => {
      const project = this.dialog.currentProject();
      if (!project) return;
      setTimeout(() => {
        const index = this.projects.findIndex(p => p.title === project.title);
        const item = this.projectItems.get(index);
        item?.nativeElement.focus();
      });
    });
  }

  /** Cleans up the resize listener to prevent memory leaks */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  /**
   * Opens the project detail dialog via service.
   * @param project The selected project object
   */
  openDialog(project: Project): void {
    this.dialog.open(project, this.projects);
  }
}