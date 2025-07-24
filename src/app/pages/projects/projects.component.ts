import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectDialogService } from './../../../assets/services/project-dialog.service';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = PROJECTS;

  constructor(private dialog: ProjectDialogService) {}

  openDialog(project: Project) {
    this.dialog.open(project, this.projects);
  }
}
