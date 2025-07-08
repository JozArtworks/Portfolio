import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { ProjectDialogComponent } from './dialog/project-dialog.component';

@Component({
  selector: 'app-projekte',
  standalone: true,
  imports: [CommonModule, ProjectDialogComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = PROJECTS;
  selectedProject: Project | null = null;
  dialogOpen = false;

  openDialog(project: Project) {
    this.selectedProject = project;
    this.dialogOpen = true;
  }

  closeDialog() {
    this.dialogOpen = false;
    this.selectedProject = null;
  }
}