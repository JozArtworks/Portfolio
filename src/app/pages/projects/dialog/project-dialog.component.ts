import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../project.interface';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent {
  @Input() project!: Project;
  @Input() show = false;
  @Input() allProjects: Project[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() changeProject = new EventEmitter<Project>();

  onClose() {
    this.close.emit();
  }

nextProject() {
  if (!this.isLast) {
    const next = this.allProjects[this.currentIndex + 1];
    this.changeProject.emit(next);
  }
}

previousProject() {
  if (!this.isFirst) {
    const prev = this.allProjects[this.currentIndex - 1];
    this.changeProject.emit(prev);
  }
}

  get currentIndex(): number {
  return this.allProjects.findIndex(p => p.title === this.project.title);
}

get isFirst(): boolean {
  return this.currentIndex === 0;
}

get isLast(): boolean {
  return this.currentIndex === this.allProjects.length - 1;
}
}
