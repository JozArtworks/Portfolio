import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';
import { Project } from './project.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectDialogService } from '../../shared/services/project-dialog.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChildren('projectItem') projectItems!: QueryList<ElementRef<HTMLDivElement>>;

  projects = PROJECTS;
  isMobileView = false;

  private resizeListener = () => {
    this.isMobileView = window.innerWidth <= 565;
  };

  constructor(private dialog: ProjectDialogService) { }

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

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  openDialog(project: Project): void {
    this.dialog.open(project, this.projects);
  }
}
