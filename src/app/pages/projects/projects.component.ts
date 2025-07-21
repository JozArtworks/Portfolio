import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { ProjectDialogComponent } from './dialog/project-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogStateService } from './../../../assets/services/dialog-state.service';
import { ProjectDialogService } from './../../../assets/services/project-dialog.service';



@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectDialogComponent, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  constructor(private dialogState: DialogStateService, private dialog: ProjectDialogService
  ) { }


  projects = PROJECTS;
  selectedProject: Project | null = null;
  dialogOpen = false;


openDialog(project: Project) {
  this.dialog.open(project, this.projects);
}

closeDialog() {
  this.dialog.close();
}

}