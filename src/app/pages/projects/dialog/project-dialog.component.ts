import { Component, Input, Output, EventEmitter, Signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../project.interface';
import { ProjectDialogService } from './../../../../assets/services/project-dialog.service';
@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
})

export class ProjectDialogComponent {
  
  constructor(public dialog: ProjectDialogService) { }

  @Input() project!: Project;
  @Input() allProjects: Project[] = [];
  @Input() show = false;

  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
  iconRight = 'assets/icons/white/svg/icon_right_white.svg';
  iconClose = 'assets/icons/white/svg/icon_close_white.svg';

  isGitHovered = false;


  get currentIndex(): number {
    return this.dialog.allProjects().findIndex(p => p.title === this.project.title);
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex === this.dialog.allProjects().length - 1;
  }

  onClose() {
    this.dialog.close();
  }

  previousProject() {
    if (!this.isFirst) {
      const prev = this.dialog.allProjects()[this.currentIndex - 1];
      this.dialog.change(prev);
    }
  }

  nextProject() {
    if (!this.isLast) {
      const next = this.dialog.allProjects()[this.currentIndex + 1];
      this.dialog.change(next);
    }
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

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.previousProject();
  }


  onHoverRight(hovered: boolean) {
    this.iconRight = hovered
      ? 'assets/icons/green/svg/icon_right_green.svg'
      : 'assets/icons/white/svg/icon_right_white.svg';
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.nextProject();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.onClose();
  }

  ngAfterViewInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

}
