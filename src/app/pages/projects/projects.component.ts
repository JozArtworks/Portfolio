import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectDialogService } from './../../../assets/services/project-dialog.service';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  @ViewChildren('projectItem') projectItems!: QueryList<ElementRef<HTMLDivElement>>;

  projects = PROJECTS;

  constructor(private dialog: ProjectDialogService) { }

  openDialog(project: Project) {
    this.dialog.open(project, this.projects);
  }

  ngOnInit() {
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




}
