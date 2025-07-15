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

  isGitHovered = false;

  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
  iconRight = 'assets/icons/white/svg/icon_right_white.svg'
  iconClose = 'assets/icons/white/svg/icon_close_white.svg'

  onClose() {
    this.close.emit();
  }

  resetHoverIcons() { 
    this.iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
    this.iconRight = 'assets/icons/white/svg/icon_right_white.svg';
  }

  nextProject() {
    if (!this.isLast) {
      const next = this.allProjects[this.currentIndex + 1];
      this.resetHoverIcons();
      this.changeProject.emit(next);
    }
  }

  previousProject() {
    if (!this.isFirst) {
      const prev = this.allProjects[this.currentIndex - 1];
      this.resetHoverIcons();
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



  onHoverClose(hovered: boolean) {
    this.iconClose = hovered
      ? 'assets/icons/green/svg/icon_close_green.svg'
      : 'assets/icons/white/svg/icon_close_white.svg';
  }

  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  onHoverRight(hovered: boolean) {
    this.iconRight = hovered
      ? 'assets/icons/green/svg/icon_right_green.svg'
      : 'assets/icons/white/svg/icon_right_white.svg';
  }


}
